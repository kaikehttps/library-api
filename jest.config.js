/**
 * Configuracao do Jest.
 *
 * - testEnvironment "node": nao precisamos de DOM/browser.
 * - coverageThreshold em 40%: exigencia minima do trabalho (o script `npm run test:coverage`
 *   falha automaticamente se a cobertura cair abaixo disso).
 * - server.js e prisma.js ficam fora da cobertura porque sao apenas "bootstrap"
 *   (abrir a porta HTTP e instanciar o PrismaClient), sem regra de negocio para testar.
 */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  clearMocks: true,
  verbose: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  collectCoverageFrom: ['src/**/*.js', '!src/server.js', '!src/infrastructure/database/prisma.js'],
  coverageThreshold: {
    global: {
      statements: 40,
      branches: 40,
      functions: 40,
      lines: 40,
    },
  },
};
