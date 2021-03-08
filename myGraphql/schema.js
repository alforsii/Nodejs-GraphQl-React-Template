const { GraphQLObjectType, GraphQLSchema } = require("graphql");
const { userQueries, userMutations } = require("./userResolver");
const { authQueries, authMutations } = require("./authResolver");

const query = new GraphQLObjectType({
  name: "Queries",
  fields: {
    ...userQueries,
    ...authQueries,
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutations",
  fields: {
    ...userMutations,
    ...authMutations,
  },
});

module.exports = new GraphQLSchema({
  query,
  mutation,
});
