import { builder, prisma } from "./builder";

builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    email: t.exposeString("email"),
    name: t.exposeString("name"),
    tasks: t.relation("tasks"),
    tags: t.relation("tags"),
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
    user: t.relation("user"),
    createdAt: t.expose("createdAt", {
      type: "Date",
    }),
    updatedAt: t.expose("updatedAt", {
      type: "Date",
    }),
  }),
});

export const schema = builder.toSchema();
