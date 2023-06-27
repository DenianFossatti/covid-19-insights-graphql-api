import { GraphQLFieldConfig, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';

import { CustomGraphQLArgs, CustomGraphQLContext } from '../../../types';
import { DateRangeInputType, buildPrismaRangeWhere } from '../../shared/filters/DateRangeFilter';

export const countPatientsGroupedByMonth: GraphQLFieldConfig<any, CustomGraphQLContext, CustomGraphQLArgs> = {
  description: 'Counter of patients infected grouped by month.',
  args: {
    filters: {
      type: DateRangeInputType,
    },
  },
  type: new GraphQLList(
    new GraphQLNonNull(
      new GraphQLObjectType({
        name: 'countPatientsGroupedByMonth',
        fields: {
          month: {
            type: new GraphQLNonNull(GraphQLInt),
          },
          year: {
            type: new GraphQLNonNull(GraphQLInt),
          },
          count: {
            type: new GraphQLNonNull(GraphQLInt),
          },
        },
      }),
    ),
  ),
  resolve: async (_root, args: CustomGraphQLArgs, ctx: CustomGraphQLContext) => {
    const query = await ctx.prisma.covid_2022.aggregateRaw({
      pipeline: [
        { $match: buildPrismaRangeWhere(args, true)?.where },
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
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            month: '$_id.month',
            year: '$_id.year',
            count: 1,
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
      count: item.count,
      year: item.year,
      month: item.month,
    }));
  },
};
