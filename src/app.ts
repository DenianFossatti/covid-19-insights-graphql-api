/* eslint-disable no-console */
import cors from '@fastify/cors';
import { useHive } from '@graphql-hive/client';
import { PrismaClient } from '@prisma/client';
import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { createYoga } from 'graphql-yoga';

import { HIVE_API_KEY, isProduction } from './config';
import schema from './schema/schema';

const prisma = new PrismaClient({
  log: [
    { level: 'warn', emit: 'event' },
    { level: 'info', emit: 'event' },
    { level: 'error', emit: 'event' },
    { level: 'query', emit: 'event' },
  ],
});

prisma.$use(async (params, next) => {
  // middleware to log query execution time
  const before = Date.now();

  const result = await next(params);

  const after = Date.now();

  console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);

  return result;
});

prisma.$on('warn', (e) => {
  console.log(e);
});

prisma.$on('info', (e) => {
  console.log(e);
});

prisma.$on('error', (e) => {
  console.log(e);
});

prisma.$on('query', (e) => {
  console.log(`QUERY: ${e.query}`);
});

const app = fastify({
  logger: true,
});

app.register(cors, {
  origin: '*',
  logLevel: 'info',
});

const yoga = createYoga<{
  req: FastifyRequest;
  reply: FastifyReply;
}>({
  schema,
  context: {
    prisma,
  },
  plugins: [
    useHive({
      enabled: true, // Enable/Disable Hive Client
      debug: false,
      token: HIVE_API_KEY,
      reporting: {
        author: 'Developer',
        commit: '1',
      },
      usage: true,
    }),
  ],
  graphiql: !isProduction,
  logging: {
    debug: (...args) => args.forEach((arg) => app.log.debug(arg)),
    info: (...args) => args.forEach((arg) => app.log.info(arg)),
    warn: (...args) => args.forEach((arg) => app.log.warn(arg)),
    error: (...args) => args.forEach((arg) => app.log.error(arg)),
  },
});

app.setErrorHandler((error, _request, _reply) => {
  console.error('Error while answering request', { error });
});

app.route({
  url: yoga.graphqlEndpoint,
  method: ['GET', 'POST', 'OPTIONS'],
  handler: async (req, reply) => {
    const response = await yoga.handleNodeRequest(req, {
      req,
      reply,
    });
    response.headers.forEach((value, key) => {
      reply.header(key, value);
    });

    reply.status(response.status);

    reply.send(response.body);

    return reply;
  },
});

export { app };
