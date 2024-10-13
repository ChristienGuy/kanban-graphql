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
            columns: {
              create: [
                {
                  title: "Todo",
                  tasks: {
                    create: [
                      {
                        title: "Create a blog post",
                        tags: {
                          create: [
                            {
                              name: "Todo",
                            },
                          ],
                        },
                      },
                      {
                        title: "Create a video",
                      },
                    ],
                  },
                },
                {
                  title: "In Progress",
                  tasks: {
                    create: [
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
            columns: {
              create: {
                title: "Todo",
                tasks: {
                  create: [
                    {
                      title: "Create a blog post",
                      tags: {
                        create: [
                          {
                            name: "Todo",
                          },
                        ],
                      },
                    },
                    {
                      title: "Create a video",
                      tags: {
                        create: [
                          {
                            name: "In Progress",
                          },
                        ],
                      },
                    },
                  ],
                },
              },
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
