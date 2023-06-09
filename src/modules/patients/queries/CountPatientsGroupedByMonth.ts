import { GraphQLFieldConfig, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';

import { CustomGraphQLArgs, CustomGraphQLContext } from '../../../types';
import { QueryFilterInputType, buildPrismaRangeWhere } from '../../shared/filters/DateRangeFilter';

export const countPatientsGroupedByMonth: GraphQLFieldConfig<any, CustomGraphQLContext, CustomGraphQLArgs> = {
  description: 'Counter of patients infected grouped by month.',
  args: {
    filters: {
      type: QueryFilterInputType,
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
    const query = await ctx.prisma.patients.aggregateRaw({
      pipeline: [
        ...(args.filters?.cityCode || (args.filters?.startDate && args.filters.endDate)
          ? [{ $match: buildPrismaRangeWhere(args, true)?.where }]
          : []),
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
