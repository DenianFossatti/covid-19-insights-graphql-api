import { GraphQLFieldConfig, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

import { CustomGraphQLArgs, CustomGraphQLContext } from '../../../types';
import { QueryFilterInputType, buildPrismaRangeWhere } from '../../shared/filters/DateRangeFilter';

export const countPatients: GraphQLFieldConfig<any, CustomGraphQLContext, CustomGraphQLArgs> = {
  type: new GraphQLNonNull(GraphQLInt),
  description: 'Counter of infected patients.',
  args: {
    filters: {
      type: QueryFilterInputType,
    },
  },
  resolve: async (_obj, args: CustomGraphQLArgs, ctx: CustomGraphQLContext) =>
    await ctx.prisma.covid_2022.count({
      ...buildPrismaRangeWhere(args),
    }),
};

export const countPatientsByAge: GraphQLFieldConfig<any, CustomGraphQLContext, CustomGraphQLArgs> = {
  type: new GraphQLNonNull(
    new GraphQLList(
      new GraphQLObjectType({
        name: 'countPatientsByAge',
        fields: {
          age: {
            type: GraphQLString,
          },
          count: {
            type: GraphQLInt,
          },
        },
      }),
    ),
  ),
  description: 'Counter of patients by age.',
  args: {
    filters: {
      type: QueryFilterInputType,
    },
  },
  resolve: async (_obj, args: CustomGraphQLArgs, ctx: CustomGraphQLContext) =>
    (
      await ctx.prisma.covid_2022.groupBy({
        by: ['faixa_etaria'],
        _count: {
          faixa_etaria: true,
        },
        ...buildPrismaRangeWhere(args),
      })
    ).map((item) => ({
      age: item.faixa_etaria,
      count: item._count.faixa_etaria,
    })),
};

export const countPatientsByRecoveryStatus: GraphQLFieldConfig<any, CustomGraphQLContext, CustomGraphQLArgs> = {
  type: new GraphQLNonNull(
    new GraphQLList(
      new GraphQLObjectType({
        name: 'countPatientsByRecoveryStatus',
        fields: {
          status: {
            type: GraphQLString,
          },
          count: {
            type: GraphQLInt,
          },
        },
      }),
    ),
  ),
  description: 'Counter of patients by recovery status.',
  args: {
    filters: {
      type: QueryFilterInputType,
    },
  },
  resolve: async (_obj, args: CustomGraphQLArgs, ctx: CustomGraphQLContext) =>
    (
      await ctx.prisma.covid_2022.groupBy({
        by: ['evolucao'],
        _count: {
          evolucao: true,
        },
        ...buildPrismaRangeWhere(args),
      })
    ).map((item) => ({
      status: item.evolucao,
      count: item._count.evolucao,
    })),
};

export const countPatientsByDiagnosisCriteria: GraphQLFieldConfig<any, CustomGraphQLContext, CustomGraphQLArgs> = {
  type: new GraphQLNonNull(
    new GraphQLList(
      new GraphQLObjectType({
        name: 'countPatientsByDiagnosisCriteria',
        fields: {
          criteria: {
            type: GraphQLString,
          },
          count: {
            type: GraphQLInt,
          },
        },
      }),
    ),
  ),
  description: 'Counter of patients by diagnosis criteria.',
  args: {
    filters: {
      type: QueryFilterInputType,
    },
  },
  resolve: async (_obj, args: CustomGraphQLArgs, ctx: CustomGraphQLContext) =>
    (
      await ctx.prisma.covid_2022.groupBy({
        by: ['criterio'],
        _count: {
          criterio: true,
        },
        ...buildPrismaRangeWhere(args),
      })
    ).map((item) => ({
      criteria: item.criterio,
      count: item._count.criterio,
    })),
};
