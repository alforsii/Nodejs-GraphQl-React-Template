const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");

module.exports = (passport) => {
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, email, password, next) => {
        try {
          const { firstName, lastName } = req.body;
          console.log(
            "🚀 ~ file: localStrategy.js ~ line 18 ~ req.body",
            req.body
          );

          const user = await User.findOne({ email });
          if (user)
            return next(null, false, {
              message: "This email already registered!",
            });
          if (!email || !firstName || !lastName || !password)
            return next(null, false, {
              message: "All fields are mandatory!",
            });
          //   //  password validation
          //   const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
          //   if (!regex.test(password)) {
          //     next(null, false, {
          //       message:
          //         "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
          //     });

          //     return;
          //   }
          const hashedPassword = await bcryptjs.hash(password, 10);
          req.body.password = hashedPassword;
          const newUser = await User.create(req.body);
          next(null, newUser);
        } catch (err) {
          console.log(err);
          next(null, false, { message: "Something went wrong!" });
        }
      }
    )
  );
  passport.use(
    "local-login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, next) => {
        console.log("🚀 ~ file: localStrategy.js ~ line 58 ~ email", email);
        try {
          const user = await User.findOne({ email });
          if (!user) return next(null, false, { message: "Incorrect email!" });
          const isPasswordCorrect = await bcryptjs.compare(
            password,
            user.password
          );
          if (isPasswordCorrect) {
            next(null, user);
          } else {
            next(null, false, { message: "Incorrect password!" });
          }
        } catch (err) {
          console.log(err);
          next(null, false, { message: "Something went wrong!" });
        }
      }
    )
  );
};
