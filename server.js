const express = require('express');
const next = require('next');
const { ApolloServer, gql } = require('apollo-server-express');
const dbConnect = require('./utils/dbConnect');
const { typeDefs, resolvers } = require('./graphql/index');
const { authUser } = require('./utils/authUser');
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  dbConnect();

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, res }) => {
      const token = req.headers.authorization;

      const user = await authUser(token);

      req.user = user;

      return { req, res };
    },
  });

  apolloServer.applyMiddleware({ app: server });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
