import { builder, prisma } from "./builder";

builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    email: t.exposeString("email"),
    name: t.exposeString("name"),
    projects: t.relation("projects"),
    createdAt: t.expose("createdAt", {
      type: "Date",
    }),
    updatedAt: t.expose("updatedAt", {
      type: "Date",
    }),
  }),
});

builder.prismaObject("Column", {
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    tasks: t.relation("tasks"),
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
    owner: t.relation("owner"),
    columns: t.relation("columns"),
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
      if (!context.auth.userId) {
        throw new Error("User not authenticated");
      }

      return prisma.project.findMany({
        ...query,
        where: { ownerId: context.auth.userId },
      });
    },
  }),
  project: t.prismaField({
    type: "Project",
    args: { id: t.arg.id({ required: true }) },
    resolve: async (query, root, args, context) => {
      if (!context.auth.userId) {
        throw new Error("User not authenticated");
      }

      return prisma.project.findUniqueOrThrow({
        ...query,
        where: {
          id: args.id,
          ownerId: context.auth.userId,
        },
      });
    },
  }),
  user: t.prismaField({
    type: "User",
    resolve: async (query, root, args, context) => {
      if (!context.auth.userId) {
        throw new Error("User not authenticated");
      }

      return prisma.user.findUniqueOrThrow({
        ...query,
        where: { id: context.auth.userId },
      });
    },
  }),
}));

builder.mutationFields((t) => ({
  createTask: t.prismaField({
    type: "Task",
    args: {
      title: t.arg.string({ required: true }),
      columnId: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args, context) => {
      if (!context.auth.userId) {
        throw new Error("User not authenticated");
      }

      return prisma.task.create({
        ...query,
        data: {
          title: args.title,
          columnId: args.columnId,
        },
      });
    },
  }),
}));

export const schema = builder.toSchema();
