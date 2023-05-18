/* eslint-disable no-console */

import { createServer } from 'http';

import app from './app';
import { GRAPHQL_HOST, GRAPHQL_PORT, isProduction } from './config';

process.env.TZ = 'UTC';

const runServer = async () => {
  const server = createServer(app.callback());

  server.listen(GRAPHQL_PORT, () => {
    console.log();
    console.log(`🚀 Server started at http://${GRAPHQL_HOST}:${GRAPHQL_PORT}`);

    if (!isProduction) {
      console.log(`🎠 GraphQL Playground available at http://${GRAPHQL_HOST}:${GRAPHQL_PORT}/playground`);
    }
  });
};

(async () => {
  console.log('\n📡 Server starting...');
  await runServer();
})();
