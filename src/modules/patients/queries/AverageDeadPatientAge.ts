import { GraphQLFieldConfig, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';

import { CustomGraphQLArgs, CustomGraphQLContext } from '../../../types';
import { DateRangeInputType, buildPrismaRangeWhere } from '../../shared/filters/DateRangeFilter';

export const averageDeadPatientAge: GraphQLFieldConfig<any, CustomGraphQLContext, CustomGraphQLArgs> = {
  resolve: async (_, args) => ({ args }), // pass args to fields resolvers
  type: new GraphQLNonNull(
    new GraphQLObjectType({
      name: 'averageDeadPatientAge',
      fields: {
        avg: {
          type: new GraphQLNonNull(GraphQLInt),
          resolve: async (root: { args: CustomGraphQLArgs }, _args, ctx: CustomGraphQLContext) => {
            const query = await ctx.prisma.covid_2022.aggregateRaw({
              pipeline: [
                {
                  $match: {
                    ...buildPrismaRangeWhere(root.args, true)?.where,
                    data_inclusao_obito: { $ne: null },
                  },
                },
                {
                  $group: {
                    _id: null,
                    avgAge: { $avg: { $toInt: '$idade' } },
                  },
                },
                {
                  $project: {
                    _id: 0,
                    avgAge: { $round: ['$avgAge'] },
                  },
                },
              ],
            });

            const result = query[0];

            if (!result || typeof result !== 'object' || Array.isArray(result) || !result.avgAge) {
              return 0;
            }

            return result.avgAge;
          },
        },
      },
    }),
  ),
  description: 'Average age of patients by notification date that died at some point later.',
  args: {
    filters: {
      type: DateRangeInputType,
    },
  },
};
