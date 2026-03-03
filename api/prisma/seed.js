import { PrismaClient } from "../src/prisma-client/generated/client/index.js";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const usersData = Array.from({ length: 10 }).map(() => ({
    name: faker.person.firstName(),
    email: faker.internet.email(),
  }));

  await prisma.user.createMany({ data: usersData });

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
