const { authJwt } = require("../middleware");
const controller = require("../controllers/photo.controller");
const multer = require('multer')
const upload = multer()

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });
    app.post(
        "/user/:userId/photo/get" ,
         controller.getPhotos);
    app.post(
        "/user/:userId/avatar" , 
        upload.any(), 
        controller.uploadAvatar)
    app.post(
        "/user/:userId/photo/uploadphotos" , 
        upload.any(), 
        controller.uploadPhotos)
    app.post(
        '/upload', 
        upload.any(), 
        controller.uploadFiles)
    app.delete(
        "/user/:userId/photos/:photoId", 
        [authJwt.verifyToken], 
        controller.deletePhoto)
};