/* eslint-disable no-console */

import { app } from './app';
import { GRAPHQL_HOST, GRAPHQL_PORT, isProduction } from './config';

process.env.TZ = 'UTC';

const runServer = async () => {
  app.listen({ port: GRAPHQL_PORT, host: '0.0.0.0' }, (error) => {
    if (error) {
      console.error(error.message);
    }
    console.log();
    console.log(`🚀 Server started at http://${GRAPHQL_HOST}:${GRAPHQL_PORT}`);

    if (!isProduction) {
      console.log(`🎠 GraphQL Playground available at http://${GRAPHQL_HOST}:${GRAPHQL_PORT}/graphql`);
    }
  });
};

(async () => {
  console.log('\n📡 Server starting...');
  await runServer();
})();
