const { TIPOS_USUARIO } = require('../entities/User');
const { StudentLoanStrategy } = require('./StudentLoanStrategy');
const { TeacherLoanStrategy } = require('./TeacherLoanStrategy');
const { AppError } = require('../../utils/errors/AppError');

/**
 * Mapa tipo de usuario -> construtor da estrategia.
 *
 * Usar um mapa no lugar de if/switch e o que torna o OCP visivel:
 * incluir "BIBLIOTECARIO com 30 dias" e adicionar UMA classe e UMA linha aqui.
 * Nenhum Use Case, Controller ou Repository precisa ser alterado.
 */
const ESTRATEGIAS_POR_TIPO = {
  [TIPOS_USUARIO.ALUNO]: StudentLoanStrategy,
  [TIPOS_USUARIO.PROFESSOR]: TeacherLoanStrategy,
};

/**
 * FACTORY METHOD (GoF).
 *
 * Problema: alguem precisa decidir QUAL estrategia usar. Se essa decisao ficar
 * no Use Case, voltamos ao if/else que o Strategy veio eliminar.
 *
 * Solucao: centralizar a criacao/selecao aqui. O CreateLoanUseCase apenas pede
 * "me da a estrategia deste usuario" e recebe algo que respeita o contrato
 * LoanDeadlineStrategy - sem conhecer StudentLoanStrategy nem TeacherLoanStrategy.
 *
 * GRASP - Creator / Low Coupling.
 */
class LoanStrategyFactory {
  /**
   * @param {string} tipoUsuario ALUNO | PROFESSOR
   * @returns {import('./LoanDeadlineStrategy').LoanDeadlineStrategy}
   */
  static create(tipoUsuario) {
    const EstrategiaEscolhida = ESTRATEGIAS_POR_TIPO[tipoUsuario];

    if (!EstrategiaEscolhida) {
      throw new AppError(`Tipo de usuario invalido para emprestimo: ${tipoUsuario}.`, 400);
    }

    return new EstrategiaEscolhida();
  }
}

module.exports = { LoanStrategyFactory };
