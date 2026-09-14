-- CreateTable
CREATE TABLE "books" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "quantidadeTotal" INTEGER NOT NULL,
    "quantidadeDisponivel" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "loans" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "livroId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "dataEmprestimo" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataDevolucaoPrevista" DATETIME NOT NULL,
    "dataDevolucaoReal" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "loans_livroId_fkey" FOREIGN KEY ("livroId") REFERENCES "books" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "loans_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "books_isbn_key" ON "books"("isbn");

-- CreateIndex
CREATE UNIQUE INDEX "users_matricula_key" ON "users"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "loans_livroId_idx" ON "loans"("livroId");

-- CreateIndex
CREATE INDEX "loans_usuarioId_idx" ON "loans"("usuarioId");
