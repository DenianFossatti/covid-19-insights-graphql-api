import { GraphQLObjectType } from 'graphql';

import * as citiesQueries from '../modules/cities/queries';
import * as countPatientsQueries from '../modules/patients/queries';
import * as countPatientsSymptomsQueries from '../modules/symptoms/queries';

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all queries.',
  fields: () => ({
    ...countPatientsQueries,
    ...countPatientsSymptomsQueries,
    ...citiesQueries,
  }),
});

export default QueryType;
