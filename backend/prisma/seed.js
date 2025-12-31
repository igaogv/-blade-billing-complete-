const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: 'Teste Dev',
      email: 'teste@dev.com',
      password: bcrypt.hashSync('12345678', 10)
    }
  });
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
