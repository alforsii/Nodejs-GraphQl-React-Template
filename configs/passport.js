const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo").default;
const User = require("../models/User.model");
const localStrategy = require("./localStrategy");

// localStrategy
localStrategy(passport);

// Serialize passport
passport.serializeUser((user, callback) => callback(null, user._id));
// Deserialize passport
passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then((user) => callback(null, user))
    .catch((error) => callback(error));
});

module.exports = (app) => {
  // session
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 14 * 24 * 60 * 60, // = 14 days. Default
      }),
    })
  );

  // passport initializations
  app.use(passport.initialize());
  app.use(passport.session());
};
