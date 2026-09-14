/**
 * Valores validos para o tipo de usuario.
 *
 * Como o SQLite nao suporta `enum` no Prisma, estas constantes sao a FONTE DA
 * VERDADE do sistema. O schema Zod e a Factory de estrategias derivam daqui,
 * evitando strings soltas ("ALUNO") espalhadas pelo codigo.
 */
const TIPOS_USUARIO = Object.freeze({
  ALUNO: 'ALUNO',
  PROFESSOR: 'PROFESSOR',
});

/** Lista usada pelo Zod e pela Factory. */
const TIPOS_USUARIO_VALIDOS = Object.freeze(Object.values(TIPOS_USUARIO));

/**
 * Entidade de dominio: Usuario.
 *
 * Nao conhece Express, nao conhece Prisma: JavaScript puro.
 */
class User {
  constructor({ id = null, nome, matricula, email, tipo, createdAt = null, updatedAt = null }) {
    this.id = id;
    this.nome = nome;
    this.matricula = matricula;
    this.email = email;
    this.tipo = tipo;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  isProfessor() {
    return this.tipo === TIPOS_USUARIO.PROFESSOR;
  }

  isAluno() {
    return this.tipo === TIPOS_USUARIO.ALUNO;
  }
}

module.exports = { User, TIPOS_USUARIO, TIPOS_USUARIO_VALIDOS };
