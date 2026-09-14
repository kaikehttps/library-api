/**
 * Erro de aplicacao com status HTTP associado.
 *
 * Existe para separar erros PREVISIVEIS (regra de negocio, recurso inexistente,
 * conflito) de erros INESPERADOS (bug, falha de conexao). O errorHandler global
 * usa o statusCode daqui para responder corretamente; qualquer outro erro que
 * chegue no middleware vira 500.
 *
 * E uma classe de JavaScript puro: nao importa Express, nao importa Prisma.
 * Por isso pode ser usada tanto pelo dominio quanto pelos Use Cases sem violar
 * a regra de dependencia da Clean Architecture.
 */
class AppError extends Error {
  /**
   * @param {string} message Mensagem exibida ao cliente da API.
   * @param {number} statusCode Status HTTP (400, 404, 409...). Padrao: 400.
   */
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}

module.exports = { AppError };
