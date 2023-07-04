import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime';

import { CustomGraphQLArgs } from '../../../types';
import { buildPrismaRangeWhere } from '../../shared/filters/DateRangeFilter';

export type BuildAggregateRawArgs = {
  args: CustomGraphQLArgs;
  groupBy?: Prisma.Covid_2022ScalarFieldEnum;
  aggregationType: 'avg' | 'countByMonth';
  match?: Record<string, any>;
};

export const buildAggregateRaw = ({
  args,
  aggregationType,
  groupBy,
  match,
}: BuildAggregateRawArgs): Prisma.covid_2022AggregateRawArgs<DefaultArgs> => {
  if ((aggregationType === 'avg' || aggregationType === 'countByMonth') && !groupBy)
    throw new Error('groupBy is required for aggregationType avg');

  const _match = {
    ...buildPrismaRangeWhere(args, true)?.where,
    ...match,
  };
  const _addFields =
    aggregationType === 'avg'
      ? undefined
      : {
          data_inclusao: { $toDate: '$data_inclusao' },
        };

  const _group =
    aggregationType === 'avg'
      ? { _id: null, field: { $avg: { $toInt: `$${groupBy}` } } }
      : {
          _id: {
            month: { $month: '$data_inclusao' },
            year: { $year: '$data_inclusao' },
          },
          field: { $avg: { $toInt: `$${groupBy}` } },
        };

  const _project =
    aggregationType === 'avg'
      ? { _id: 0, [groupBy!]: { $round: ['$field'] } }
      : {
          month: '$_id.month',
          year: '$_id.year',
          [groupBy!]: { $round: ['$field'] },
          _id: 0,
        };

  const _sort = aggregationType === 'avg' ? undefined : { year: 1, month: 1 };

  return {
    pipeline: [
      ...(_match ? [{ $match: _match }] : []),
      ...(_addFields ? [{ $addFields: _addFields }] : []),
      {
        $group: _group,
      },
      {
        $project: _project,
      },
      ...(_sort ? [{ $sort: _sort }] : []),
    ],
  };
};
