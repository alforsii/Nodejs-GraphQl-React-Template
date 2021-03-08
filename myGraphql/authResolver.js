const bcryptjs = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User.model");
const { SignupArgs, LoginArgs, UserType } = require("./Types");

// User Queries
const authQueries = {
  isLoggedIn: {
    type: UserType,
    resolve: (_, args, { req, graphPassport }) => {
      try {
        const user = graphPassport.getUser();
        console.log("user 1", user);
        if (user) {
          user.message = "User logged in!";

          return user;
        } else {
          return { message: "Log in first!" };
        }
      } catch (err) {
        console.log("logout err", err.message);
        return err;
      }
    },
  },
};
// User Mutations
const authMutations = {
  signup: {
    type: UserType,
    args: SignupArgs,
    resolve: async (_, args) => {
      try {
        let user = await User.findOne({ email: args.email });
        if (user) throw new Error("This email already registered!");
        const hashedPassword = await bcryptjs.hash(args.password, 10);
        args.password = hashedPassword;
        user = await User.create(args);
        user.message = "User successfully signed up!";
        return user;
      } catch (err) {
        console.log(err);
        return err;
      }
    },
  },
  login: {
    type: UserType,
    args: LoginArgs,
    resolve: async (_, { email, password }, { graphPassport, req }) => {
      try {
        // instead of email you can pass username as well

        const { user, info } = await graphPassport.authenticate(
          "graphql-local",
          {
            email,
            password,
          }
        );

        // only required if express-session is used
        await graphPassport.login(user);

        user.message = "User successfully logged in!";
        return user;
      } catch (err) {
        console.log(err);
        return err;
      }
    },
  },
  logout: {
    type: UserType,
    resolve: async (_, args, { graphPassport }) => {
      try {
        await graphPassport.logout();
        return { message: "Logged out successful!" };
      } catch (err) {
        console.log("logout err", err.message);
        return err;
      }
    },
  },
};

module.exports = { authQueries, authMutations };
