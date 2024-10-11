import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const typeDefs = `#graphql
  type Task {
    id: ID!
    title: String!
    tags: [Tag!]!
  }

  type Tag {
    id: ID!
    name: String!
    tasks: [Task!]!
  }

  type Query {
    tasks: [Task!]!
    tags: [Tag!]!
  }
`;

// TODO: move to database

const tasks = [
  {
    id: "1",
    title: "Create a new Remix app",
    tags: [
      { id: "1", name: "Remix" },
      {
        id: "2",
        name: "GraphQL",
      },
    ],
  },
  {
    id: "2",
    title: "Add a GraphQL server",
    tags: [{ id: "2", name: "GraphQL" }],
  },
];

const resolvers = {
  Query: {
    tasks() {
      return tasks;
    },
    tags() {
      return tasks.flatMap((task) => task.tags);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: {
    port: Number(process.env.PORT) || 4000,
  },
});

console.log(`🚀 Server ready at ${url}`);
