import { GraphQLFieldConfig, GraphQLInt, GraphQLNonNull } from 'graphql';

import { CustomGraphQLArgs, CustomGraphQLContext } from '../../../types';
import { DateRangeInputType, buildPrismaRangeWhere } from '../../shared/filters/DateRangeFilter';

export const countPatients: GraphQLFieldConfig<any, CustomGraphQLContext, CustomGraphQLArgs> = {
  type: new GraphQLNonNull(GraphQLInt),
  description: 'Counter of patients.',
  args: {
    filters: {
      type: DateRangeInputType,
    },
  },
  resolve: async (_obj, args: CustomGraphQLArgs, ctx: CustomGraphQLContext) =>
    await ctx.prisma.covid_2022.count({
      ...buildPrismaRangeWhere(args),
    }),
};
