import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import { schema } from "./schema";
import { clerkMiddleware, getAuth } from "@clerk/express";
import express from "express";
import cors from "cors";
import http from "http";

const app = express();
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);

const server = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use("*", express.json(), cors<cors.CorsRequest>());

app.use(
  "/",
  clerkMiddleware(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      const auth = getAuth(req);

      return {
        auth,
      };
    },
  }),
);

await new Promise<void>((resolve) => {
  httpServer.listen({ port: 4000 }, resolve);
});

console.log(`🚀 Server ready at http://localhost:4000`);
