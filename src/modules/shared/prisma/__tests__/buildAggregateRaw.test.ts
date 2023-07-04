import { buildAggregateRaw } from '../buildAggregateRaw';

describe('buildAggregateRaw', () => {
  it('should build aggregateRaw for avg', () => {
    const result = buildAggregateRaw({
      aggregationType: 'avg',
      groupBy: 'idade',
      args: {
        filters: {
          endDate: '2022-10-27T03:00:00.000Z',
          startDate: '2022-10-27T03:00:00.000Z',
        },
      },
    });

    expect(result).toMatchSnapshot();
  });

  it('should build aggregateRaw for countByMonth', () => {
    const result = buildAggregateRaw({
      aggregationType: 'countByMonth',
      groupBy: 'idade',
      args: {
        filters: {
          endDate: '2022-10-27T03:00:00.000Z',
          startDate: '2022-10-27T03:00:00.000Z',
        },
      },
    });

    expect(result).toMatchSnapshot();
  });

  it('should build aggregateRaw for countByMonth and match options', () => {
    const result = buildAggregateRaw({
      aggregationType: 'countByMonth',
      groupBy: 'idade',
      args: {
        filters: {
          endDate: '2022-10-27T03:00:00.000Z',
          startDate: '2022-10-27T03:00:00.000Z',
        },
      },
      match: {
        data_inclusao_obito: { $ne: null },
      },
    });

    expect(result).toMatchSnapshot();
  });
});
