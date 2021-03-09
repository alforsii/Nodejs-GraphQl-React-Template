require("dotenv").config();
const express = require("express");
const expressGraphQl = require("express-graphql");
const morgan = require("morgan");
const myCors = require("./configs/cors.config");

const myDatabase = require("./configs/db.config");
const { graphqlSchema } = require("./myGraphql/schema/index");
const { graphqlResolvers } = require("./myGraphql/resolvers/index");
// const isAuth = require("./middleware/isAuth");

// express init
const app = express();
const port = process.env.PORT || 5000;
// // my DB connection
myDatabase();

// /** set parser before routes */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Cors config
myCors(app);

// Check for user auth
// app.use(isAuth);

// Graphql route with nodejs connection
app.use(
  "/graphql",

  expressGraphQl.graphqlHTTP({
    graphiql: true,
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
  })
);

app.listen(port, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${`/graphql`}`)
);
