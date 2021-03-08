const authResolvers = require("./authResolvers");

const graphqlResolvers = {
  ...authResolvers,
};

exports.graphqlResolvers = graphqlResolvers;
