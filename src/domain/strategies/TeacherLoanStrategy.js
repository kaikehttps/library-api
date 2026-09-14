const { LoanDeadlineStrategy } = require('./LoanDeadlineStrategy');

/** REGRA 2: professor tem prazo maior que o aluno -> 14 dias. */
const DIAS_PRAZO_PROFESSOR = 14;

/**
 * STRATEGY (GoF) - implementacao concreta para PROFESSOR.
 *
 * LSP: pode substituir LoanDeadlineStrategy em qualquer lugar, pois respeita
 * exatamente o mesmo contrato e nao adiciona pre-condicoes.
 */
class TeacherLoanStrategy extends LoanDeadlineStrategy {
  getDiasDePrazo() {
    return DIAS_PRAZO_PROFESSOR;
  }
}

module.exports = { TeacherLoanStrategy, DIAS_PRAZO_PROFESSOR };
