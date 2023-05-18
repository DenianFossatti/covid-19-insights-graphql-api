/* eslint-disable no-console */

import cors from '@koa/cors';
import Router from '@koa/router';
import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { koaPlayground } from 'graphql-playground-middleware';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { graphqlHTTP } from 'koa-graphql';
import logger from 'koa-logger';

import { NODE_ENV, isProduction } from './config';

import schema from './schema/schema';
import { CustomGraphQLContext } from './types';

const prisma = new PrismaClient();

const app = new Koa<any, CustomGraphQLContext>();
const router = new Router<any, CustomGraphQLContext>();

app.use(bodyParser());
app.use(cors());

app.on('error', (error) => {
  console.error('Error while answering request', { error });
});

if (isProduction) {
  app.proxy = true;
}

if (NODE_ENV !== 'test') {
  app.use(logger());
}

if (!isProduction) {
  router.all('/playground', koaPlayground({ endpoint: '/graphql' }));
}

const graphqlServer = graphqlHTTP((_request, _response, ctx) => {
  return {
    graphiql: !isProduction,
    schema,
    context: {
      prisma,
    },
    customFormatErrorFn: (error: GraphQLError) => {
      if (error.name && error.name === 'BadRequestError') {
        ctx.status = 400;
        ctx.body = 'Bad Request';
        return {
          message: 'Bad Request',
        };
      }

      if (error.path || error.name !== 'GraphQLError') {
        console.error(error);
      } else {
        console.log(`GraphQLWrongQuery: ${error.message}`);
      }

      console.error('GraphQL Error', { error });

      if (!isProduction) {
        return {
          message: error.message,
          locations: error.locations,
          stack: error.stack,
        };
      } else {
        ctx.status = 400;
        ctx.body = 'Bad Request';
        return {
          message: 'Bad Request',
        };
      }
    },
  };
});

router.all('/graphql', graphqlServer);

app.use(router.routes()).use(router.allowedMethods());

export default app;
