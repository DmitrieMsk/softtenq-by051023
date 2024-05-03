const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
      verifySignUp.validateEmail,
      verifySignUp.validatePassword,
      verifySignUp.validateUsername
    ],
    controller.signup
  );
  app.get(
    "/auth/confirm/:hashId",
    controller.confirmRegistration
  )

  app.post("/auth/signin", controller.signin);
};