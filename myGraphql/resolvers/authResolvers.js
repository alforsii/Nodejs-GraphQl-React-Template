const bcryptjs = require("bcryptjs");
const { json } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../../models/User.model");

module.exports = {
  signup: async ({ data }) => {
    try {
      let user = await User.findOne({ email: data.email });
      if (user) throw new Error("This email already registered!");
      const hashedPassword = await bcryptjs.hash(data.password, 10);
      data.password = hashedPassword;
      user = await User.create(data);
      user.message = "User successfully signed up!";
      return user;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
  login: async ({ email, password }) => {
    console.log("🚀login: ~ { email, password }", { email, password });
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User not found!");
      }
      const isEqual = await bcryptjs.compare(password, user.password);
      if (!isEqual) {
        throw new Error("Wrong password!");
      }

      const token = jwt.sign(
        { userId: user.id, email },
        process.env.SECRET_TOKEN,
        { expiresIn: "1h" }
      );
      return { userId: user.id, token, tokenExpiration: 1 };
    } catch (err) {
      console.log(err);
      return err;
    }
  },
  isLoggedIn: async (args, req) => {
    console.log("isLoggedIn: ~ args", args);
    console.log(req.isAuth);
    if (!req.isAuth) {
      throw new Error("Not authorized!");
    }

    return await User.findById(req.userId);
  },
  allUsers: async () => {
    return await User.find().sort({ _id: 1 });
  },
  someUsers: async ({ page, limit }, req) => {
    console.log(req.isAuth);
    if (!req.isAuth) {
      throw new Error("Not authorized!");
    }
    const skip = page * limit;
    return await User.find().sort({ _id: 1 }).skip(skip).limit(limit);
  },
  getUser: async ({ id }) => {
    try {
      return await User.findById(id);
    } catch (err) {
      console.log(err);
    }
  },
};
