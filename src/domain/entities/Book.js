const { AppError } = require('../../utils/errors/AppError');

/**
 * Entidade de dominio: Livro.
 *
 * GRASP - Information Expert: quem sabe quantos exemplares existem e o proprio
 * livro, entao e ele quem controla a baixa e o retorno de exemplares.
 * As REGRAS 4, 5 e 6 vivem aqui, e nao espalhadas pelos Use Cases.
 *
 * Nao conhece Express, nao conhece Prisma: JavaScript puro.
 */
class Book {
  constructor({
    id = null,
    titulo,
    autor,
    isbn,
    categoria,
    quantidadeTotal,
    quantidadeDisponivel,
    createdAt = null,
    updatedAt = null,
  }) {
    this.id = id;
    this.titulo = titulo;
    this.autor = autor;
    this.isbn = isbn;
    this.categoria = categoria;
    this.quantidadeTotal = quantidadeTotal;
    // Livro recem-cadastrado tem todos os exemplares disponiveis.
    this.quantidadeDisponivel = quantidadeDisponivel ?? quantidadeTotal;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /** REGRA 4 (consulta): existe exemplar livre no acervo? */
  temExemplarDisponivel() {
    return this.quantidadeDisponivel > 0;
  }

  /**
   * REGRA 4 + REGRA 5: da baixa em um exemplar ao criar um emprestimo.
   * Protege a propria invariante: nunca emprestar sem estoque.
   */
  emprestarExemplar() {
    if (!this.temExemplarDisponivel()) {
      throw new AppError('Nao ha exemplares disponiveis deste livro para emprestimo.', 409);
    }
    this.quantidadeDisponivel -= 1;
  }

  /**
   * REGRA 6: devolve um exemplar ao acervo.
   * Nunca pode ultrapassar a quantidade total cadastrada.
   */
  devolverExemplar() {
    if (this.quantidadeDisponivel >= this.quantidadeTotal) {
      throw new AppError('Todos os exemplares deste livro ja constam no acervo.', 409);
    }
    this.quantidadeDisponivel += 1;
  }

  /**
   * Quantidade de exemplares atualmente emprestados.
   * Usado ao atualizar o livro: a nova quantidadeTotal nao pode ser menor
   * do que o numero de exemplares que estao na mao dos usuarios.
   */
  exemplaresEmprestados() {
    return this.quantidadeTotal - this.quantidadeDisponivel;
  }

  /**
   * Ajusta o total de exemplares mantendo coerente a quantidade disponivel.
   * Ex.: 5 totais / 2 emprestados -> alterar total para 4 resulta em 2 disponiveis.
   */
  alterarQuantidadeTotal(novaQuantidadeTotal) {
    const emprestados = this.exemplaresEmprestados();
    if (novaQuantidadeTotal < emprestados) {
      throw new AppError(
        `Nao e possivel reduzir para ${novaQuantidadeTotal} exemplares: ` +
          `${emprestados} ainda estao emprestados.`,
        409
      );
    }
    this.quantidadeTotal = novaQuantidadeTotal;
    this.quantidadeDisponivel = novaQuantidadeTotal - emprestados;
  }
}

module.exports = { Book };
