require("dotenv").config();
const express = require("express");

// const { ApolloServer } = require("apollo-server-express");
// const cookieParser = require("cookie-parser");
const morgan = require("morgan");
// const schema = require("./myGraphql/schema");
const myCors = require("./configs/cors.config");
const expressGraphQl = require("express-graphql");

// const {
//   GraphQLLocalStrategy,
//   buildContext,
//   createOnConnect,
// } = require("graphql-passport");

const myDatabase = require("./configs/db.config");
// const myPassport = require("./configs/passport");
const myPassport = require("./configs/passportGraphql");
const { graphqlSchema } = require("./myGraphql/schema/index");
const { graphqlResolvers } = require("./myGraphql/resolvers/index");
const isAuth = require("./middleware/isAuth");

// express init
const app = express();
const port = process.env.PORT || 5000;
// // my DB connection
myDatabase();

// /** set parser before routes */
// app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Passport
// myPassport(app);

// Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Cors config
myCors(app);

// Check for user auth
app.use(isAuth);

// Graphql route with nodejs connection
app.use(
  "/graphql",

  expressGraphQl.graphqlHTTP({
    graphiql: true,
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
  })
);

// const server = new ApolloServer({
//   // typeDefs: RootTypeDefs,
//   // resolvers: RootResolvers,
//   schema,

//   context: ({ req, res }) => {
//     const user = req.user || null;
//     return {
//       req,
//       res,
//       graphPassport: buildContext({ req, res }),
//       user,
//     };
//   },
// });

// server.applyMiddleware({ app, path: "/graphql", cors: false });

// routes
// app.use("/auth", require("./routes/auth"));

app.listen(port, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${`/graphql`}`)
);

// // Graphql route with nodejs connection
// app.use(
//   "/graphql",
//   express.json(),

//   expressGraphQl.graphqlHTTP({
//     schema: graphqlSchema,
//     graphiql: true,
//     // context: ({ req, res }) => buildContext({ req, res, User }),
//   })
// );

// app.listen(port, () => console.log(`Server running on port ${port}`));
