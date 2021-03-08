const passport = require("passport");
const bcryptjs = require("bcryptjs");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const { ApolloServer } = require("apollo-server-express");
const graphqlPassport = require("graphql-passport");
const User = require("../models/User.model");
const schema = require("../myGraphql/schema");

// Graphql localStrategy
const { GraphQLLocalStrategy, buildContext, createOnConnect } = graphqlPassport;

// Serializer
passport.serializeUser((user, callback) => callback(null, user._id));

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then((user) => callback(null, user))
    .catch((error) => callback(error));
});

passport.use(
  new GraphQLLocalStrategy(
    { passReqToCallback: true },
    async (req, email, password, done) => {
      try {
        let user = await User.findOne({ email });
        if (!user) {
          return done(new Error("Wrong email!"), {});
        }
        const isMatchPasswords = await bcryptjs.compare(
          password,
          user.password
        );
        if (isMatchPasswords) {
          user.message = "User successfully logged in!";

          return done(null, user);
        } else {
          return done(new Error("Wrong password!"), {});
        }
      } catch (err) {
        console.log(err);
        return err;
      }
    }
  )
);

module.exports = (app) => {
  const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 24 * 360,
    }),
    cookie: { maxAge: 60 * 60 * 24, httpOnly: true },
  });

  const passportMiddleware = passport.initialize();
  const passportSessionMiddleware = passport.session();

  app.use(sessionMiddleware);
  app.use(passportMiddleware);
  app.use(passportSessionMiddleware);

  //   const server = new ApolloServer({
  //     // typeDefs: RootTypeDefs,
  //     // resolvers: RootResolvers,
  //     schema,
  //     context: ({ req, res }) => ({
  //       req,
  //       res,
  //       graphPassport: buildContext({ req, res }),
  //     }),
  //     subscriptions: {
  //       onConnect: createOnConnect([
  //         sessionMiddleware,
  //         passportMiddleware,
  //         passportSessionMiddleware,
  //       ]),
  //     },
  //   });

  //   server.applyMiddleware({ app, path: "/graphql", cors: false });

  //   app.listen(port, () =>
  //     console.log(
  //       `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  //     )
  //   );
};
