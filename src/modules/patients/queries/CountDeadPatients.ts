import { GraphQLFieldConfig, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

import { CustomGraphQLArgs, CustomGraphQLContext } from '../../../types';
import { DateRangeInputType, buildPrismaRangeWhere } from '../../shared/filters/DateRangeFilter';

export const countDeadPatients: GraphQLFieldConfig<any, CustomGraphQLContext, CustomGraphQLArgs> = {
  resolve: async (_, args) => ({ args }), // pass args to fields resolvers
  type: new GraphQLNonNull(
    new GraphQLObjectType({
      name: 'countDeadPatients',
      fields: {
        count: {
          type: new GraphQLNonNull(GraphQLInt),
          resolve: async (root: { args: CustomGraphQLArgs }, _args, ctx: CustomGraphQLContext) =>
            await ctx.prisma.covid_2022.count({
              where: {
                ...buildPrismaRangeWhere(root.args)?.where,
                data_inclusao_obito: {
                  not: null,
                },
              },
            }),
        },
      },
    }),
  ),
  description: 'Counter of patients by notification date that died at some point later.',
  args: {
    filters: {
      type: DateRangeInputType,
    },
  },
};

export const countDeadPatientsGroupedByCity: GraphQLFieldConfig<any, CustomGraphQLContext, CustomGraphQLArgs> = {
  type: new GraphQLNonNull(
    new GraphQLList(
      new GraphQLObjectType({
        name: 'countDeadPatientsGroupedByCity',
        fields: {
          name: {
            type: GraphQLString,
          },
          count: {
            type: GraphQLInt,
          },
        },
      }),
    ),
  ),
  resolve: async (_root, args: CustomGraphQLArgs, ctx: CustomGraphQLContext) =>
    (
      await ctx.prisma.covid_2022.groupBy({
        by: ['municipio'],
        _count: {
          _all: true,
        },
        where: {
          ...buildPrismaRangeWhere(args)?.where,
          data_inclusao_obito: {
            not: null,
          },
        },
      })
    ).map((item) => ({
      name: item.municipio,
      count: item._count._all,
    })),
  description: 'Counter of patients by notification date that died at some point later grouped by city.',
  args: {
    filters: {
      type: DateRangeInputType,
    },
  },
};

export const countDeadPatientsGroupedByMonth: GraphQLFieldConfig<any, CustomGraphQLContext, CustomGraphQLArgs> = {
  type: new GraphQLNonNull(
    new GraphQLList(
      new GraphQLObjectType({
        name: 'countDeadPatientsGroupedByMonth',
        fields: {
          month: {
            type: GraphQLInt,
          },
          year: {
            type: GraphQLInt,
          },
          count: {
            type: GraphQLInt,
          },
        },
      }),
    ),
  ),
  resolve: async (_root, args: CustomGraphQLArgs, ctx: CustomGraphQLContext) => {
    const query = await ctx.prisma.covid_2022.aggregateRaw({
      pipeline: [
        {
          $match: {
            ...buildPrismaRangeWhere(args, true)?.where,
            data_inclusao_obito: { $ne: null },
          },
        },
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
  description: 'Counter of patients by notification date that died at some point later grouped by month.',
  args: {
    filters: {
      type: DateRangeInputType,
    },
  },
};
