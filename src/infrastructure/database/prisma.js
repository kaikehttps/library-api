const { PrismaClient } = require('@prisma/client');

/**
 * Instancia unica do PrismaClient compartilhada pela aplicacao.
 *
 * Criar um `new PrismaClient()` por requisicao abriria varias conexoes com o
 * SQLite e esgotaria o pool. Este arquivo e o UNICO ponto do sistema que
 * conhece o Prisma Client; apenas os repositorios de infraestrutura o importam.
 */
const prisma = new PrismaClient();

module.exports = prisma;
