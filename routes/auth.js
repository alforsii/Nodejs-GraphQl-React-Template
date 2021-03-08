const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User.model");

// GET | Is logged in
// GET | users
router.get("/isLoggedIn", async (req, res) => {
  if (req.user) {
    req.user.password = undefined;
    res.status(200).json({ user: req.user });
    return;
  }
  res.status(401).json({ message: "Enter email and password!" });
});

// POST | Login
//=-=-=-===-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==
// Login using passport
//=-=-=-===-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==
router.post("/login", (req, res, next) => {
  passport.authenticate("local-login", (err, user, failureDetails) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Something went wrong with database query." });
      return;
    }

    if (!user) {
      res.status(401).json(failureDetails);
      return;
    }

    req.login(user, (err) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Something went wrong with login!" });
      user.password = undefined;
      res.status(200).json({ message: "Login - successful!", user });
    });
  })(req, res, next);
});
// POST | Signup
//=-=-=-===-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==
// Signup using passport
//=-=-=-===-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==
router.post("/signup", (req, res, next) => {
  passport.authenticate("local-signup", (err, user, failureDetails) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Something went wrong with database query." });
      return;
    }

    if (!user) {
      res.status(401).json(failureDetails);
      return;
    }

    req.login(user, (err) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Something went wrong with login!" });
      user.password = undefined;
      res.status(200).json({ message: "Signed up - successful!", user });
    });
  })(req, res, next);
});

// GET | Logout
router.post("/logout", (req, res) => {
  const theUser = req.user;
  req.logout();
  res.status(200).json({
    message: `Logout successful! We gonna miss you ${theUser.firstName}😌! Hope to see you soon, bye!👋`,
  });
});

// GET | users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
