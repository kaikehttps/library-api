const { AppError } = require('../../utils/errors/AppError');

/**
 * Valores validos para o status de um emprestimo.
 * Mesma justificativa de TIPOS_USUARIO: SQLite nao suporta enum no Prisma,
 * entao o dominio e a fonte da verdade.
 */
const STATUS_EMPRESTIMO = Object.freeze({
  ATIVO: 'ATIVO',
  DEVOLVIDO: 'DEVOLVIDO',
  ATRASADO: 'ATRASADO',
});

const STATUS_EMPRESTIMO_VALIDOS = Object.freeze(Object.values(STATUS_EMPRESTIMO));

/** Limite de emprestimos ativos simultaneos por usuario (REGRA 1). */
const LIMITE_EMPRESTIMOS_ATIVOS = 3;

/**
 * Entidade de dominio: Emprestimo.
 *
 * Concentra as REGRAS 7 e 8. O status ATRASADO nao e gravado por um job
 * agendado: ele e DERIVADO da comparacao entre a data atual e a data prevista
 * de devolucao (ver `statusAtual`). Isso mantem o sistema correto mesmo que a
 * API fique dias sem ser usada, e e simples de explicar.
 *
 * Nao conhece Express, nao conhece Prisma: JavaScript puro.
 */
class Loan {
  constructor({
    id = null,
    livroId,
    usuarioId,
    dataEmprestimo = new Date(),
    dataDevolucaoPrevista,
    dataDevolucaoReal = null,
    status = STATUS_EMPRESTIMO.ATIVO,
    createdAt = null,
    updatedAt = null,
  }) {
    this.id = id;
    this.livroId = livroId;
    this.usuarioId = usuarioId;
    // Normaliza para Date: os dados podem chegar como string (JSON) ou Date (Prisma).
    this.dataEmprestimo = dataEmprestimo ? new Date(dataEmprestimo) : new Date();
    this.dataDevolucaoPrevista = dataDevolucaoPrevista ? new Date(dataDevolucaoPrevista) : null;
    this.dataDevolucaoReal = dataDevolucaoReal ? new Date(dataDevolucaoReal) : null;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  estaDevolvido() {
    return this.status === STATUS_EMPRESTIMO.DEVOLVIDO;
  }

  /**
   * REGRA 8: um emprestimo nao devolvido cuja data prevista ja passou
   * esta atrasado.
   * @param {Date} dataReferencia injetavel para deixar o teste deterministico.
   */
  estaAtrasado(dataReferencia = new Date()) {
    if (this.estaDevolvido()) return false;
    return dataReferencia > this.dataDevolucaoPrevista;
  }

  /**
   * REGRA 8: status efetivo do emprestimo no momento da consulta.
   * ATIVO vencido passa a ser apresentado como ATRASADO.
   */
  statusAtual(dataReferencia = new Date()) {
    if (this.estaDevolvido()) return STATUS_EMPRESTIMO.DEVOLVIDO;
    return this.estaAtrasado(dataReferencia) ? STATUS_EMPRESTIMO.ATRASADO : STATUS_EMPRESTIMO.ATIVO;
  }

  /**
   * REGRA 7: registra a devolucao. Um emprestimo ja devolvido nao pode
   * ser devolvido novamente (409 Conflict).
   */
  devolver(dataDevolucao = new Date()) {
    if (this.estaDevolvido()) {
      throw new AppError('Este emprestimo ja foi devolvido.', 409);
    }
    this.dataDevolucaoReal = new Date(dataDevolucao);
    this.status = STATUS_EMPRESTIMO.DEVOLVIDO;
    return this;
  }

  /** Dias de atraso (0 quando esta em dia). Util para exibicao. */
  diasDeAtraso(dataReferencia = new Date()) {
    if (!this.estaAtrasado(dataReferencia)) return 0;
    const MS_POR_DIA = 1000 * 60 * 60 * 24;
    const diferenca = dataReferencia.getTime() - this.dataDevolucaoPrevista.getTime();
    return Math.floor(diferenca / MS_POR_DIA);
  }
}

module.exports = {
  Loan,
  STATUS_EMPRESTIMO,
  STATUS_EMPRESTIMO_VALIDOS,
  LIMITE_EMPRESTIMOS_ATIVOS,
};
