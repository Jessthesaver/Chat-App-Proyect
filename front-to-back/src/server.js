import express from "express";
import { ApolloServer } from "@apollo/server";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import { parse } from "cookie-parse";
import cookieParser from "cookie-parser";
import {} from "dotenv/config";

import typeDefs from "./schema.js";
import resolvers from "./resolvers/resolvers.js";

import AuthAPI from "./datasources/authAPI.js";
import UserAPI from "./datasources/usersAPI.js";
import ChatAPI from "./datasources/chatAPI.js";
import { GraphQLError } from "graphql";

const server = async () => {
  const app = express();

  const port = process.env.PORT || 3500;

  const httpServer = createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx) => {
        const { cache } = server;

        const { JWT } = parse(ctx.extra.request.headers.cookie);

        let authUser;

        if (JWT) {
          authUser = await new AuthAPI().secureRoute(JWT);
          const { user } = authUser;

          if (!user) {
            throw new GraphQLError("Internal Error", {
              extensions: {
                code: "UNAUTHENTICATED",
                http: { status: 401 },
              },
            });
          }

          const fromUserService = await new UserAPI().getUser(user);

          authUser = { ...authUser.user, ...fromUserService.user };
        }

        const dataSources = {
          authAPI: new AuthAPI({ cache }),
          userAPI: new UserAPI({ cache }),
          chatAPI: new ChatAPI({ cache }),
        };
        return {
          dataSources,
          authUser,
        };
      },
    },
    wsServer
  );

  const server = new ApolloServer({
    schema,
    introspection: process.env.NODE_ENV !== "production",
    playground: process.env.NODE_ENV !== "production",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),

      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(
    "/graphql",
    cookieParser(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const { cache } = server;
        const { JWT } = req.cookies;

        let authUser;

        if (JWT) {
          authUser = await new AuthAPI().secureRoute(JWT);
          const { user } = authUser;

          if (!user) {
            throw new GraphQLError("Internal Error", {
              extensions: {
                code: "UNAUTHENTICATED",
                http: { status: 401 },
              },
            });
          }

          const fromUserService = await new UserAPI().getUser(user);

          authUser = { ...authUser.user, ...fromUserService.user };
        }

        const dataSources = {
          authAPI: new AuthAPI({ cache }),
          userAPI: new UserAPI({ cache }),
          chatAPI: new ChatAPI({ cache }),
        };
        return {
          authUser,
          req,
          res,
          dataSources,
        };
      },
    })
  );

  httpServer.listen(port, () => {
    console.log(`Server ready at ${port}`);
  });
};

export default server;
