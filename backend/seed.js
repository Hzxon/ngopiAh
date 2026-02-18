const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const pasaswordRahasia = await bcrypt.hash("admin123", 10);

  const user = await prisma.user.create({
    data: {
      email: "admin@ngopiah.me",
      name: "Admin Hazron",
      password: pasaswordRahasia,
    },
  });
  console.log("Admin dibuat: ", user);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());

