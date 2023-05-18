import { GraphQLObjectType } from 'graphql';

import { countPatients } from '../modules/patients/queries';
import { countPatientsSymptoms } from '../modules/symptoms/queries';

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all queries.',
  fields: () => ({
    countPatients,
    countPatientsSymptoms,
  }),
});

export default QueryType;
