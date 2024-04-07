const { authJwt } = require("../middleware");
const { verifySignUp } = require("../middleware");
const controller = require("../controllers/news.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get(
    "/post/:postId" , 
    controller.getPost
  );
  app.post(
    "/post/create",
    controller.createPost
  );
  app.post(
    "/post/:postId/edit",
    controller.changePost
  );
  app.post(
   "/feed",
   controller.feed 
  );
  app.post(
    "/post/user/:userId",
    controller.getUserPosts 
   );
};