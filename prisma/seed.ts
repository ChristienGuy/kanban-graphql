import { Prisma, PrismaClient } from "@prisma/client";

// TODO: seed local db with some tasks and tags
const prisma = new PrismaClient();
try {
  const chris = await prisma.user.upsert({
    where: { email: "chris@chrisguy.me" },
    update: {},
    create: {
      email: "chris@chrisguy.me",
      name: "Chris",
      tasks: {
        create: [
          {
            title: "Create a blog post",
            tags: {
              create: [
                {
                  name: "blog",
                },
              ],
            },
          },
          {
            title: "Create a video",
            tags: {
              create: [
                {
                  name: "video",
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(chris);
  await prisma.$disconnect();
} catch (error) {
  console.error(error);
  await prisma.$disconnect();
}
