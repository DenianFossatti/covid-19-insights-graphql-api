import { GraphQLFieldConfig, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';

import { CustomGraphQLArgs, CustomGraphQLContext } from '../../../types';
import { QueryFilterInputType } from '../../shared/filters/DateRangeFilter';
import { buildAggregateRaw } from '../../shared/prisma/buildAggregateRaw';

export const averageDeadPatientAge: GraphQLFieldConfig<any, CustomGraphQLContext, CustomGraphQLArgs> = {
  resolve: async (_, args) => ({ args }), // pass args to fields resolvers
  type: new GraphQLNonNull(
    new GraphQLObjectType({
      name: 'averageDeadPatientAge',
      fields: {
        avg: {
          type: new GraphQLNonNull(GraphQLInt),
          resolve: async (root: { args: CustomGraphQLArgs }, _args, ctx: CustomGraphQLContext) => {
            const query = await ctx.prisma.patients.aggregateRaw(
              buildAggregateRaw({
                args: root.args,
                aggregationType: 'avg',
                groupBy: 'idade',
                match: {
                  data_inclusao_obito: { $ne: null },
                },
              }),
            );

            const result = query[0];

            if (!result || typeof result !== 'object' || Array.isArray(result) || !result.idade) {
              return 0;
            }

            return result.idade;
          },
        },
      },
    }),
  ),
  description: 'Average age of patients by notification date that died at some point later.',
  args: {
    filters: {
      type: QueryFilterInputType,
    },
  },
};
