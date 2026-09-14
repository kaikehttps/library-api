const prisma = require('../src/infrastructure/database/prisma');
const { TIPOS_USUARIO } = require('../src/domain/entities/User');
const { STATUS_EMPRESTIMO } = require('../src/domain/entities/Loan');
const { LoanStrategyFactory } = require('../src/domain/strategies/LoanStrategyFactory');

/**
 * Seed de demonstracao.
 *
 * Objetivo: deixar o banco em um estado que permita demonstrar TODAS as regras
 * de negocio na apresentacao, sem precisar cadastrar nada na mao.
 *
 * Repare que o seed usa a MESMA Factory + Strategy da aplicacao para calcular
 * as datas previstas de devolucao. Se o prazo do professor mudar de 14 para 20
 * dias, muda em um lugar so e o seed acompanha automaticamente.
 */

/** Helper: data deslocada em N dias a partir de hoje (negativo = passado). */
function diasAPartirDeHoje(dias) {
  const data = new Date();
  data.setDate(data.getDate() + dias);
  return data;
}

async function limparBanco() {
  // A ordem importa por causa das chaves estrangeiras: emprestimos primeiro.
  await prisma.loan.deleteMany();
  await prisma.user.deleteMany();
  await prisma.book.deleteMany();
}

async function main() {
  console.log('Limpando o banco...');
  await limparBanco();

  console.log('Cadastrando livros...');
  const livros = await Promise.all([
    prisma.book.create({
      data: {
        titulo: 'Clean Architecture',
        autor: 'Robert C. Martin',
        isbn: '9780134494166',
        categoria: 'Engenharia de Software',
        quantidadeTotal: 3,
        quantidadeDisponivel: 3,
      },
    }),
    prisma.book.create({
      data: {
        titulo: 'Design Patterns: Elements of Reusable Object-Oriented Software',
        autor: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
        isbn: '9780201633610',
        categoria: 'Engenharia de Software',
        quantidadeTotal: 2,
        quantidadeDisponivel: 2,
      },
    }),
    prisma.book.create({
      data: {
        titulo: 'Domain-Driven Design',
        autor: 'Eric Evans',
        isbn: '9780321125217',
        categoria: 'Engenharia de Software',
        quantidadeTotal: 2,
        quantidadeDisponivel: 2,
      },
    }),
    prisma.book.create({
      data: {
        titulo: 'Refactoring',
        autor: 'Martin Fowler',
        isbn: '9780134757599',
        categoria: 'Engenharia de Software',
        quantidadeTotal: 1,
        quantidadeDisponivel: 1,
      },
    }),
    // Livro sem exemplar disponivel: serve para demonstrar a REGRA 4 (409).
    prisma.book.create({
      data: {
        titulo: 'Algoritmos: Teoria e Pratica',
        autor: 'Thomas H. Cormen',
        isbn: '9788535236996',
        categoria: 'Algoritmos',
        quantidadeTotal: 1,
        quantidadeDisponivel: 0,
      },
    }),
  ]);

  console.log('Cadastrando usuarios...');
  const [aluno, professor, alunoAtrasado] = await Promise.all([
    prisma.user.create({
      data: {
        nome: 'Ana Souza',
        matricula: '2024001',
        email: 'ana.souza@universidade.edu.br',
        tipo: TIPOS_USUARIO.ALUNO,
      },
    }),
    prisma.user.create({
      data: {
        nome: 'Carlos Pereira',
        matricula: '2024002',
        email: 'carlos.pereira@universidade.edu.br',
        tipo: TIPOS_USUARIO.PROFESSOR,
      },
    }),
    prisma.user.create({
      data: {
        nome: 'Bruno Lima',
        matricula: '2024003',
        email: 'bruno.lima@universidade.edu.br',
        tipo: TIPOS_USUARIO.ALUNO,
      },
    }),
  ]);

  console.log('Cadastrando emprestimos...');

  // Emprestimo ATIVO de um aluno (prazo de 7 dias calculado pela Strategy).
  const estrategiaAluno = LoanStrategyFactory.create(aluno.tipo);
  const hoje = new Date();
  await prisma.loan.create({
    data: {
      livroId: livros[0].id,
      usuarioId: aluno.id,
      dataEmprestimo: hoje,
      dataDevolucaoPrevista: estrategiaAluno.calcularDataDevolucao(hoje),
      status: STATUS_EMPRESTIMO.ATIVO,
    },
  });
  await prisma.book.update({
    where: { id: livros[0].id },
    data: { quantidadeDisponivel: { decrement: 1 } },
  });

  // Emprestimo ATRASADO: emprestado ha 20 dias, prazo de aluno (7 dias) ja venceu.
  // Serve para demonstrar as REGRAS 3 e 8 -> este usuario nao consegue pegar
  // um novo livro emprestado.
  const dataEmprestimoAntigo = diasAPartirDeHoje(-20);
  await prisma.loan.create({
    data: {
      livroId: livros[1].id,
      usuarioId: alunoAtrasado.id,
      dataEmprestimo: dataEmprestimoAntigo,
      dataDevolucaoPrevista: estrategiaAluno.calcularDataDevolucao(dataEmprestimoAntigo),
      status: STATUS_EMPRESTIMO.ATIVO,
    },
  });
  await prisma.book.update({
    where: { id: livros[1].id },
    data: { quantidadeDisponivel: { decrement: 1 } },
  });

  console.log('\nSeed concluido com sucesso!');
  console.log('----------------------------------------------------');
  console.log(`Livros cadastrados ....: ${livros.length}`);
  console.log(`Aluno em dia ..........: id=${aluno.id} (${aluno.nome})`);
  console.log(`Professor .............: id=${professor.id} (${professor.nome})`);
  console.log(`Aluno com atraso ......: id=${alunoAtrasado.id} (${alunoAtrasado.nome})`);
  console.log(`Livro sem estoque .....: id=${livros[4].id} (${livros[4].titulo})`);
  console.log('----------------------------------------------------');
}

main()
  .catch((erro) => {
    console.error('Erro ao executar o seed:', erro);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
