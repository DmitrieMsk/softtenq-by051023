const { authJwt } = require("../middleware");
const { verifySignUp } = require("../middleware");
const controller = require("../controllers/userReactions.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post(
    "/like/submit",
    controller.submitLike
  );
  app.get(
    "/post/:postId/getlikes",
    controller.getLikeCount
  );
  app.post(
    "/comment/create",
     controller.createComment
  );
  app.get(
    "/comment/:commentId/",
    controller.getComment
  );
  app.post(
    "/like/user/:userId/getliked",
    controller.getLiked
  );
  app.post(
    "/comment/:commentId/edit",
    controller.changeComment
  );
  app.post(
    "/comment/:topicId/getall",
    controller.getAllComments
  );  
  app.get(
    "/comment/user/:userId/getall",
    controller.getAllUserComments
  );
};
  