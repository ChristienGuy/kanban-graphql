import { Prisma, PrismaClient } from "@prisma/client";

// TODO: seed local db with some tasks and tags
const prisma = new PrismaClient();

const userId = "user_2nId6I2W0TJgGsFWdoM9xf6A78g";
try {
  const chris = await prisma.user.upsert({
    where: { email: "chris@chrisguy.me" },
    update: {},
    create: {
      id: userId,
      email: "chris@chrisguy.me",
      name: "Chris",
      projects: {
        create: [
          {
            title: "Kanban board",
            tasks: {
              create: [
                {
                  title: "Create a blog post",
                  userId,
                  tags: {
                    create: [
                      {
                        name: "blog",
                        userId,
                      },
                    ],
                  },
                },
                {
                  title: "Create a video",
                  userId,
                  tags: {
                    create: [
                      {
                        name: "video",
                        userId,
                      },
                    ],
                  },
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
