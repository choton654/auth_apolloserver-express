// const next = require('next');

// const nextApp = next({
//   dev: process.env.NODE_ENV !== 'production',
//   dir: __dirname,
// });

// module.exports = nextApp;

// const express = require('express');
// const apolloServer = require('./graphql/index');
// const nextApp = require('./index');
// const dbConnect = require('./utils/dbConnect');

// const PORT = 3000;

// async function main() {
//   const app = express();
//   dbConnect();

//   await bootstrapApolloServer(app);
//   await bootstrapClientApp(app);

//   app.listen(PORT, (err) => {
//     if (err) throw err;
//     console.log(`[ server ] ready on port ${PORT}`);
//   });
// }

// async function bootstrapClientApp(expressApp) {
//   await nextApp.prepare();
//   expressApp.get('*', nextApp.getRequestHandler());
// }

// async function bootstrapApolloServer(expressApp) {
//   apolloServer.applyMiddleware({ app: expressApp });
// }

// main();
