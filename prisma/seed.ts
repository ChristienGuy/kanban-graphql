import { Prisma, PrismaClient } from "@prisma/client";

// TODO: seed local db with some tasks and tags
const prisma = new PrismaClient();

const userId = "user_2nId6I2W0TJgGsFWdoM9xf6A78g";
const maryUserId = "user_cpc6cYcNEufp4Hcb7MEkzo3ekyq";
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
                        name: "Todo",
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
                        name: "In Progress",
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

  const mary = await prisma.user.upsert({
    where: { email: "mary@chrisguy.me" },
    update: {},
    create: {
      email: "mary@chrisguy.me",
      name: "Mary",
      id: maryUserId,
      projects: {
        create: [
          {
            title: "Mary's Kanban board",
            tasks: {
              create: [
                {
                  title: "Create a blog post",
                  userId: maryUserId,
                  tags: {
                    create: [
                      {
                        name: "Todo",
                        userId: maryUserId,
                      },
                    ],
                  },
                },
                {
                  title: "Create a video",
                  userId: maryUserId,
                  tags: {
                    create: [
                      {
                        name: "In Progress",
                        userId: maryUserId,
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
  console.log(mary);
  await prisma.$disconnect();
} catch (error) {
  console.error(error);
  await prisma.$disconnect();
}
