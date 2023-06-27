import { GraphQLFieldConfig, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';

import { CustomGraphQLArgs, CustomGraphQLContext } from '../../../types';
import { DateRangeInputType, buildPrismaRangeWhere } from '../../shared/filters/DateRangeFilter';

export const averageInfectedPatientAge: GraphQLFieldConfig<any, CustomGraphQLContext, CustomGraphQLArgs> = {
  resolve: async (_, args) => ({ args }), // pass args to fields resolvers
  type: new GraphQLNonNull(
    new GraphQLObjectType({
      name: 'averageInfectedPatientAge',
      fields: {
        avg: {
          type: new GraphQLNonNull(GraphQLInt),
          resolve: async (root: { args: CustomGraphQLArgs }, _args, ctx: CustomGraphQLContext) => {
            const query = await ctx.prisma.covid_2022.aggregateRaw({
              pipeline: [
                ...(root.args.filters ? [{ $match: buildPrismaRangeWhere(root.args, true)?.where }] : []),
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
              throw new Error('No data found');
            }

            return result.avgAge;
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
            const query = await ctx.prisma.covid_2022.aggregateRaw({
              pipeline: [
                ...(root.args.filters ? [{ $match: buildPrismaRangeWhere(root.args, true)?.where }] : []),
                {
                  $addFields: {
                    data_inclusao: { $toDate: '$data_inclusao' },
                  },
                },
                {
                  $group: {
                    _id: {
                      month: { $month: '$data_inclusao' },
                      year: { $year: '$data_inclusao' },
                    },
                    avgAge: { $avg: { $toInt: '$idade' } },
                  },
                },
                {
                  $project: {
                    month: '$_id.month',
                    year: '$_id.year',
                    avgAge: { $round: ['$avgAge'] },
                    _id: 0,
                  },
                },
                {
                  $sort: {
                    year: 1,
                    month: 1,
                  },
                },
              ],
            });

            if (!query || !Array.isArray(query)) {
              throw new Error('No data found');
            }

            return query.map((item) => ({
              avg: item.avgAge,
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
      type: DateRangeInputType,
    },
  },
};
