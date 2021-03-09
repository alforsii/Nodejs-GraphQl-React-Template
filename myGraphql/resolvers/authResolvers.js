const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User.model");

const generateToken = (userId, email) => {
  return jwt.sign({ userId, email }, process.env.SECRET_TOKEN, {
    expiresIn: "1d",
  });
};

module.exports = {
  signup: async ({ data }) => {
    try {
      let user = await User.findOne({ email: data.email });
      if (user) throw new Error("This email already registered!");
      const hashedPassword = await bcryptjs.hash(data.password, 10);
      data.password = hashedPassword;
      user = await User.create(data);

      return user;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User not found!");
      }
      const isEqual = await bcryptjs.compare(password, user.password);
      if (!isEqual) {
        throw new Error("Wrong password!");
      }

      const token = generateToken(user.id, email);
      return { userId: user.id, token, tokenExpiration: 1 };
    } catch (err) {
      console.log(err);
      return err;
    }
  },
  isLoggedIn: ({ token }) => {
    if (!token || token === "") {
      return null;
    }
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
    } catch (err) {
      console.log(err.message);
      return err;
    }

    if (!decodedToken || !decodedToken.userId || !decodedToken.email) {
      throw new Error("Not authorized!");
    }
    // const newToken = generateToken(decodedToken.userId, decodedToken.email);
    return { userId: decodedToken.userId, token, tokenExpiration: 1 };
  },
  allUsers: async (args, req) => {
    return await User.find().sort({ _id: 1 });
  },
  someUsers: async ({ page, limit }, req) => {
    const skip = page * limit;
    return await User.find().sort({ _id: 1 }).skip(skip).limit(limit);
  },
  getUser: async ({ id }, req) => {
    try {
      return await User.findById(id);
    } catch (err) {
      console.log(err);
    }
  },
};
