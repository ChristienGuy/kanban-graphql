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
      console.log("context.auth.userId", context.auth.userId);
      if (!context.auth.userId) {
        throw new Error("User not authenticated");
      }

      return prisma.project.findMany({
        where: { userId: context.auth.userId },
      });
    },
  }),
  project: t.prismaField({
    type: "Project",
    args: { id: t.arg.id() },
    resolve: async (query, root, args, context) => {
      if (!context.auth.userId) {
        throw new Error("User not authenticated");
      }

      return prisma.project.findUniqueOrThrow({
        where: {
          id: args.id ?? undefined,
          userId: context.auth.userId,
        },
      });
    },
  }),
  tasks: t.prismaField({
    type: ["Task"],
    resolve: async (query, root, args, context) => {
      if (!context.auth.userId) {
        throw new Error("User not authenticated");
      }

      return prisma.task.findMany({
        where: { userId: context.auth.userId },
      });
    },
  }),
  tags: t.prismaField({
    type: ["Tag"],
    resolve: async (query, root, args, context) => {
      if (!context.auth.userId) {
        throw new Error("User not authenticated");
      }

      return prisma.tag.findMany({
        where: {
          userId: context.auth.userId,
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
        where: { id: context.auth.userId },
      });
    },
  }),
}));

builder.mutationFields((t) => ({
  createTask: t.prismaField({
    type: "Task",
    args: {
      title: t.arg.string(),
      projectId: t.arg.id(),
    },
    resolve: async (query, root, args, context) => {
      return prisma.task.create({
        data: {
          title: args.title,
          userId: context.auth.userId,
          projectId: args.projectId,
        },
      });
    },
  }),
}));

export const schema = builder.toSchema();
