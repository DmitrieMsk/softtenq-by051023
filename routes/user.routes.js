const { authJwt } = require("../middleware");
const { verifySignUp } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get(
    "/user/:userId/" , 
    controller.userPage
  );

  app.post("/myprofile",[authJwt.verifyToken], controller.myProfile)
  app.post("/user/verify", [authJwt.verifyToken], controller.verifyUser)
  app.post("/settings", 
  [authJwt.verifyToken,
    verifySignUp.validateEmail,
    verifySignUp.validateUsername], controller.settings)
  app.get("/test/all", controller.allAccess);

  app.get(
    "/test/user",
    [authJwt.verifyToken],
    controller.userBoard
  );

  app.get(
    "/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
  app.post(
    "/user/search", 
    controller.searchForUser
  );
};