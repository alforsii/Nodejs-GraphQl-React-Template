const User = require("../models/User.model");
const { UserType } = require("./Types");
const { GraphQLString, GraphQLInt, GraphQLList } = require("graphql");

// User Queries
const userQueries = {
  allUsers: {
    type: new GraphQLList(UserType),
    resolve: async () => await User.find(),
  },
};
// User Mutations
const userMutations = {
  deleteUser: {
    type: UserType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: async (_, { id }) => {
      try {
        await User.findByIdAndDelete(id);
        return { message: "User removed" };
      } catch (err) {
        console.log(err);
      }
    },
  },
  getUser: {
    type: UserType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: async (_, { id }) => {
      try {
        const user = await User.findById(id);
        return {
          ...user,
          message: "User found!",
        };
      } catch (err) {
        console.log(err);
      }
    },
  },
  someUsers: {
    type: new GraphQLList(UserType),
    args: {
      page: { type: GraphQLInt },
      limit: { type: GraphQLInt },
    },
    resolve: async (_, { page, limit }) => {
      const skip = page * limit;

      return await User.find().sort({ _id: 1 }).skip(skip).limit(limit);
    },
  },
};

module.exports = { userQueries, userMutations };
