const { LoanDeadlineStrategy } = require('./LoanDeadlineStrategy');

/** REGRA 2: aluno tem prazo de 7 dias. */
const DIAS_PRAZO_ALUNO = 7;

/**
 * STRATEGY (GoF) - implementacao concreta para ALUNO.
 *
 * LSP: pode substituir LoanDeadlineStrategy em qualquer lugar, pois respeita
 * exatamente o mesmo contrato e nao adiciona pre-condicoes.
 */
class StudentLoanStrategy extends LoanDeadlineStrategy {
  getDiasDePrazo() {
    return DIAS_PRAZO_ALUNO;
  }
}

module.exports = { StudentLoanStrategy, DIAS_PRAZO_ALUNO };
