import { AuthObject } from "@clerk/express";
import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import PrismaTypes from "@pothos/plugin-prisma/generated";
import { PrismaClient } from "@prisma/client";
import { DateResolver } from "graphql-scalars";

export const prisma = new PrismaClient();

export const builder = new SchemaBuilder<{
  Scalars: {
    Date: { Input: Date; Output: Date };
  };
  Context: {
    auth: AuthObject;
  };
  PrismaTypes: PrismaTypes;
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
    // warn when not using a query parameter correctly
    onUnusedQuery: process.env.NODE_ENV === "production" ? null : "warn",
  },
});

builder.queryType({
  fields: (t) => ({
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
  }),
});
// builder.mutationType();

builder.addScalarType("Date", DateResolver);
