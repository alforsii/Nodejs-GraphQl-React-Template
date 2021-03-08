const cors = require("cors");

module.exports = (app) => {
  // Cross-Origin Resource Sharing
  //1. Manually
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // 2. With cors npm
  // app.use(
  //   cors({
  //     // origin: ['www.web-side.com', 'http://localhost:3000']
  //     origin: [process.env.FRONTEND_POINT],
  //     // origin: true,
  //     credentials: true, // this needs set up on the frontend side as well
  //     //                   in axios "withCredentials: true"
  //     //    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  //     //    optionsSuccessStatus: 204,
  //     //  preflightContinue: false
  //   })
  // );
};
