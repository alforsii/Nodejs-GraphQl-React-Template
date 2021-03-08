const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
} = require("graphql");

// Args types | MongoDb types
const UserSchemaType = {
  email: { type: GraphQLString },
  firstName: { type: GraphQLString },
  lastName: { type: GraphQLString },
};
const SignupArgs = {
  ...UserSchemaType,
  password: { type: GraphQLString },
};
const LoginArgs = {
  email: { type: GraphQLString },
  password: { type: GraphQLString },
};

// User graphql schema type
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    ...UserSchemaType,
    _id: { type: GraphQLString },
    message: { type: GraphQLString },
  }),
});

module.exports = {
  UserType,
  UserSchemaType,
  SignupArgs,
  LoginArgs,
};
