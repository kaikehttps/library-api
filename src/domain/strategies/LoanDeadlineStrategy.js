const { AppError } = require('../../utils/errors/AppError');

/**
 * STRATEGY (GoF) - abstracao.
 *
 * Problema: o prazo de devolucao muda conforme o tipo de usuario (REGRA 2).
 * Resolver isso com `if (tipo === 'PROFESSOR') ... else ...` dentro do
 * CreateLoanUseCase espalharia condicionais e obrigaria a alterar o Use Case
 * a cada novo tipo de usuario.
 *
 * Solucao: cada tipo de usuario tem uma estrategia com o MESMO contrato.
 * O Use Case chama `estrategia.calcularDataDevolucao(...)` sem saber qual
 * implementacao esta sendo usada.
 *
 * A aritmetica de datas fica aqui (uma unica vez) e cada estrategia concreta
 * declara apenas o proprio prazo em dias -> adicionar um novo tipo de usuario
 * e criar uma classe de 3 linhas, sem tocar em nada existente (OCP).
 */
class LoanDeadlineStrategy {
  /**
   * Metodo abstrato: deve ser implementado pelas estrategias concretas.
   * @returns {number} quantidade de dias de prazo.
   */
  getDiasDePrazo() {
    throw new AppError(
      'getDiasDePrazo() deve ser implementado pela estrategia concreta.',
      500
    );
  }

  /**
   * Calcula a data prevista de devolucao a partir da data do emprestimo.
   * @param {Date} dataEmprestimo
   * @returns {Date}
   */
  calcularDataDevolucao(dataEmprestimo = new Date()) {
    const dataPrevista = new Date(dataEmprestimo);
    dataPrevista.setDate(dataPrevista.getDate() + this.getDiasDePrazo());
    return dataPrevista;
  }
}

module.exports = { LoanDeadlineStrategy };
