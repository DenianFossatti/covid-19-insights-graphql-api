import { GraphQLFieldConfig, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';

import { CustomGraphQLArgs, CustomGraphQLContext } from '../../../types';
import { QueryFilterInputType, buildPrismaRangeWhere } from '../../shared/filters/DateRangeFilter';

export const countPatientsSymptoms: GraphQLFieldConfig<any, CustomGraphQLContext, CustomGraphQLArgs> = {
  description: 'Counter of patients symptoms.',
  resolve: async (_, args) => ({ args }), // pass args to fields resolvers
  args: {
    filters: {
      type: QueryFilterInputType,
    },
  },
  type: new GraphQLNonNull(
    new GraphQLObjectType({
      name: 'countPatientsSymptoms',
      fields: {
        febre: {
          type: new GraphQLNonNull(GraphQLInt),
          resolve: async (root: { args: CustomGraphQLArgs }, _args, ctx: CustomGraphQLContext) =>
            ctx.prisma.covid_2022.count({ where: { febre: true, ...buildPrismaRangeWhere(root.args)?.where } }),
        },
        garganta: {
          type: new GraphQLNonNull(GraphQLInt),
          resolve: (root: { args: CustomGraphQLArgs }, _args, ctx: CustomGraphQLContext) =>
            ctx.prisma.covid_2022.count({ where: { garganta: true, ...buildPrismaRangeWhere(root.args)?.where } }),
        },
        tosse: {
          type: new GraphQLNonNull(GraphQLInt),
          resolve: (root: { args: CustomGraphQLArgs }, _args, ctx: CustomGraphQLContext) =>
            ctx.prisma.covid_2022.count({ where: { tosse: true, ...buildPrismaRangeWhere(root.args)?.where } }),
        },
        dispneia: {
          type: new GraphQLNonNull(GraphQLInt),
          resolve: (root: { args: CustomGraphQLArgs }, _args, ctx: CustomGraphQLContext) =>
            ctx.prisma.covid_2022.count({ where: { dispneia: true, ...buildPrismaRangeWhere(root.args)?.where } }),
        },
        outros: {
          type: new GraphQLNonNull(GraphQLInt),
          resolve: (root: { args: CustomGraphQLArgs }, _args, ctx: CustomGraphQLContext) =>
            ctx.prisma.covid_2022.count({
              where: { outros_sintomas: true, ...buildPrismaRangeWhere(root.args)?.where },
            }),
        },
      },
    }),
  ),
};
