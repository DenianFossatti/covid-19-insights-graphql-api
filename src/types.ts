import { PrismaClient } from '@prisma/client';

export interface CustomGraphQLContext {
  prisma: PrismaClient;
}

export interface CustomGraphQLArgs {
  filters?: {
    startDate?: string;
    endDate?: string;
  };
}
