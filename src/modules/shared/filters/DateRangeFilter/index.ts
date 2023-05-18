import { GraphQLInputObjectType } from 'graphql';

import { GraphQLDateTime } from 'graphql-scalars';

import { CustomGraphQLArgs } from '../../../../types';

export const DateRangeInputType: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: 'DateRangeFilter',
  description: 'Used to filter by a range of dates.',
  fields: () => ({
    startDate: {
      type: GraphQLDateTime,
    },
    endDate: {
      type: GraphQLDateTime,
    },
  }),
});

export const buildPrismaRangeWhere = (args: CustomGraphQLArgs) =>
  args?.filters?.endDate && args.filters.startDate
    ? {
        where: {
          data_inclusao: {
            gte: args?.filters?.startDate,
            lte: args?.filters?.endDate,
          },
        },
      }
    : null;
