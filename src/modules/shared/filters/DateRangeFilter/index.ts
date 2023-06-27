/* eslint-disable @typescript-eslint/no-inferrable-types */
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

export const buildPrismaRangeWhere = (args: CustomGraphQLArgs, raw: boolean = false) =>
  args?.filters?.endDate && args.filters.startDate
    ? {
        where: {
          data_inclusao: {
            [raw ? '$gte' : 'gte']: args?.filters?.startDate,
            [raw ? '$lte' : 'lte']: args?.filters?.endDate,
          },
        },
      }
    : null;
