import argon2 from "argon2";
import prisma from "@/lib/prisma";

async function main() {
  const password = await argon2.hash("password");
  const alice = await prisma.user.upsert({
    where: { email: "alice@kyna.dev" },
    update: {
      emailVerified: new Date(),
      password,
    },
    create: {
      email: "alice@kyna.dev",
      name: "Alice",
      password,
    },
  });
  const bob = await prisma.user.upsert({
    where: { email: "bob@kyna.dev" },
    update: {
      emailVerified: new Date(),
      password,
    },
    create: {
      email: "bob@kyna.dev",
      name: "Bob",
      password,
    },
  });
  console.log({ alice, bob });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
