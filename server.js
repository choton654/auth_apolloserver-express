const express = require('express');
const next = require('next');
const cookieParser = require('cookie-parser');
const { ApolloServer } = require('apollo-server-express');
const dbConnect = require('./utils/dbConnect');
const schema = require('./graphql/index');
const { authUser } = require('./utils/authUser');
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const bodyParser = require('body-parser');
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(cookieParser());

  dbConnect();

  const apolloServer = new ApolloServer({
    schema,
    context: async ({ req, res }) => {
      const token = req.cookies['jwt'];
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
