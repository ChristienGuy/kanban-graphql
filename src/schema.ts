import { builder, prisma } from "./builder";

builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    email: t.exposeString("email"),
    name: t.exposeString("name"),
    tasks: t.relation("tasks"),
    tags: t.relation("tags"),
    projects: t.relation("projects"),
    createdAt: t.expose("createdAt", {
      type: "Date",
    }),
    updatedAt: t.expose("updatedAt", {
      type: "Date",
    }),
  }),
});

builder.prismaObject("Project", {
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    tasks: t.relation("tasks"),
    user: t.relation("user"),
    createdAt: t.expose("createdAt", {
      type: "Date",
    }),
    updatedAt: t.expose("updatedAt", {
      type: "Date",
    }),
  }),
});

builder.prismaObject("Task", {
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    tags: t.relation("tags"),
    user: t.relation("user"),
    project: t.relation("project"),
    createdAt: t.expose("createdAt", {
      type: "Date",
    }),
    updatedAt: t.expose("updatedAt", {
      type: "Date",
    }),
  }),
});

builder.prismaObject("Tag", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    tasks: t.relation("tasks"),
    user: t.relation("user"),
    createdAt: t.expose("createdAt", {
      type: "Date",
    }),
    updatedAt: t.expose("updatedAt", {
      type: "Date",
    }),
  }),
});

builder.queryFields((t) => ({
  projects: t.prismaField({
    type: ["Project"],
    resolve: async (query, root, args, context) => {
      return prisma.project.findMany({
        where: { userId: context.auth.userId ?? undefined },
      });
    },
  }),
  project: t.prismaField({
    type: "Project",
    args: { id: t.arg.id() },
    resolve: async (query, root, args, context) => {
      return prisma.project.findUniqueOrThrow({
        where: { id: args.id ?? undefined },
      });
    },
  }),
  tasks: t.prismaField({
    type: ["Task"],
    resolve: async (query, root, args, context) => {
      return prisma.task.findMany({
        where: { userId: context.auth.userId ?? undefined },
      });
    },
  }),
  tags: t.prismaField({
    type: ["Tag"],
    resolve: async (query, root, args, context) => {
      return prisma.tag.findMany({
        where: {
          userId: context.auth.userId ?? undefined,
        },
      });
    },
  }),
  user: t.prismaField({
    type: "User",
    resolve: async (query, root, args, context) => {
      return prisma.user.findUniqueOrThrow({
        where: { id: context.auth.userId ?? "" },
      });
    },
  }),
}));

export const schema = builder.toSchema();
