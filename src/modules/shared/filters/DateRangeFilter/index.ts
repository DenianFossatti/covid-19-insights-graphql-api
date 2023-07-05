/* eslint-disable @typescript-eslint/no-inferrable-types */
import { GraphQLInputObjectType, GraphQLString } from 'graphql';

import { GraphQLDateTime } from 'graphql-scalars';

import { CustomGraphQLArgs } from '../../../../types';

export const QueryFilterInputType: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: 'QueryFilterInputType',
  description: 'Used to filter by a range of dates or city code.',
  fields: () => ({
    startDate: {
      type: GraphQLDateTime,
    },
    endDate: {
      type: GraphQLDateTime,
    },
    cityCode: {
      description: 'City code from IBGE, get from `cities` query.',
      type: GraphQLString,
    },
  }),
});

export const buildPrismaRangeWhere = (args: CustomGraphQLArgs, raw: boolean = false) =>
  (args?.filters?.endDate && args.filters.startDate) || args.filters?.cityCode
    ? {
        where: {
          ...(args?.filters?.endDate && args.filters.startDate
            ? {
                data_inclusao: {
                  [raw ? '$gte' : 'gte']: raw
                    ? {
                        $date: args?.filters?.startDate,
                      }
                    : new Date(args?.filters?.startDate),
                  [raw ? '$lte' : 'lte']: raw
                    ? {
                        $date: args?.filters?.endDate,
                      }
                    : new Date(args?.filters?.endDate),
                },
              }
            : {}),
          ...(args.filters.cityCode
            ? {
                cod_ibge: {
                  [raw ? '$eq' : 'equals']: args.filters?.cityCode,
                },
              }
            : {}),
        },
      }
    : null;
