import { GraphQLFieldConfig, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

import { CustomGraphQLArgs, CustomGraphQLContext } from '../../../types';

export const cities: GraphQLFieldConfig<any, CustomGraphQLContext, CustomGraphQLArgs> = {
  description: 'Get all available cities.',
  resolve: async (_obj, _args: CustomGraphQLArgs, ctx: CustomGraphQLContext) =>
    (await ctx.prisma.cities.findMany()).map((city) => ({
      name: city.nome,
      code: city.cod_ibge,
    })),
  type: new GraphQLList(
    new GraphQLNonNull(
      new GraphQLObjectType({
        name: 'cities',
        fields: {
          name: {
            type: new GraphQLNonNull(GraphQLString),
          },
          code: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
      }),
    ),
  ),
};
