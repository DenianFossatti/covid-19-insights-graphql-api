import { GraphQLFieldConfig, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';

import { CustomGraphQLArgs, CustomGraphQLContext } from '../../../types';
import { QueryFilterInputType } from '../../shared/filters/DateRangeFilter';
import { buildAggregateRaw } from '../../shared/prisma/buildAggregateRaw';

export const averageInfectedPatientAge: GraphQLFieldConfig<any, CustomGraphQLContext, CustomGraphQLArgs> = {
  resolve: async (_, args) => ({ args }), // pass args to fields resolvers
  type: new GraphQLNonNull(
    new GraphQLObjectType({
      name: 'averageInfectedPatientAge',
      fields: {
        avg: {
          type: new GraphQLNonNull(GraphQLInt),
          resolve: async (root: { args: CustomGraphQLArgs }, _args, ctx: CustomGraphQLContext) => {
            const query = await ctx.prisma.patients.aggregateRaw(
              buildAggregateRaw({
                args: root.args,
                aggregationType: 'avg',
                groupBy: 'idade',
              }),
            );

            const result = query[0];

            if (!result || typeof result !== 'object' || Array.isArray(result) || !result.idade) {
              throw new Error('No data found');
            }

            return result.idade;
          },
        },
        groupedByMonth: {
          type: new GraphQLNonNull(
            new GraphQLList(
              new GraphQLObjectType({
                name: 'averageInfectedPatientAgeGroupedByMonth',
                fields: {
                  month: {
                    type: new GraphQLNonNull(GraphQLInt),
                  },
                  year: {
                    type: new GraphQLNonNull(GraphQLInt),
                  },
                  avg: {
                    type: new GraphQLNonNull(GraphQLInt),
                  },
                },
              }),
            ),
          ),
          resolve: async (root: { args: CustomGraphQLArgs }, _args, ctx: CustomGraphQLContext) => {
            const query = await ctx.prisma.patients.aggregateRaw(
              buildAggregateRaw({
                args: root.args,
                aggregationType: 'countByMonth',
                groupBy: 'idade',
              }),
            );

            if (!query || !Array.isArray(query)) {
              throw new Error('No data found');
            }

            return query.map((item) => ({
              avg: item.idade,
              year: item.year,
              month: item.month,
            }));
          },
        },
      },
    }),
  ),
  description: 'Average age of patients by notification date that got infected.',
  args: {
    filters: {
      type: QueryFilterInputType,
    },
  },
};
