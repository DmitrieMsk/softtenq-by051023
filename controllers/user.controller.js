const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Relation = db.relation;
const UserLinksPhoto = db.user_links_photo;

const path = require('path')
const {google} = require('googleapis')
const KEYFILEPATH = path.join(__dirname + "/../credentials.json")
const SCOPES = ['https://www.googleapis.com/auth/drive']
const folderID = ['1vb8-adjrLWlsXnsb2odFlqOTDWHW-v_I']
const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES
})
const Op = db.Sequelize.Op;
const googleLink = "https://drive.google.com/file/d/";
exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  
  exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
  };
  
  exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
  };
  
  exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
  };
  exports.userPage = (req, res) => { 
    console.log(Number.isInteger (Number(req.params["userId"])))
    if(!Number.isInteger(Number(req.params["userId"]))){
      res.status(406).send("Invalid input")
      return;
    }
      User.findOne({
        where: {
          id: req.params["userId"]
        }
      }).then(user => {
        if (!user) {
          res.status(404).send({
            message: "Failed! User doesn't exist!"
          });
          return;
        }
        else{
          res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture
          });
        }
      });
    
  }
  exports.profilePicture = async (req, res, photoLink) => {
    try{
      User.findOne({
        where: {
          id: req.params["userId"]
        }
      }).then(user => {
        console.log(user)
        user.profilePicture = photoLink
        user.save()
        res.status(200).send()
      })
    } catch {
      res.status(500).send()
    }
    
    
  }

  exports.getAvatarLink = (req, res) => {
    try{
      User.findOne({
        where: {
          id: req.params["userId"]
        }
      }).then(user => {
        _link = user.profilePicture
        console.log(_link)
        res.status(200).send(_link)
      })
    } catch {
      res.status(500).send()
    }
  }
  exports.image = (req, res, photoLink) => {
    UserLinksPhoto.create({
      user_id: req.params["userId"],
      googledrive_id: photoLink
    })
      .catch(err => {
        console.log(err.message)
      });
  }
  exports.getPhotos = (req, res) => {
    try{
      let photosArray = []
      UserLinksPhoto.findAll({
        where: {
          user_id: req.params["userId"]
        }
      }).then(photos => {
        photos.forEach((photo) => {
          let photoJson = {
            id: photo.id,
            userId: photo.user_id,
            link: photo.googledrive_id
          }
          photosArray.push(photoJson)
        })
        res.status(200).send(photosArray);
      })
    } catch{
      res.status(500).send()
    }
  }
  exports.deletePhoto = (req, res) => {
    let _fileId = ""


    
    try{
      UserLinksPhoto.findOne({
        where: {
          user_id: req.params["userId"],
          id: req.params["photoId"]
        }}).then(photo => {
          if(photo === undefined || photo === null) {
            res.status(500).send("Failed to find the photo")
            return
          }
          _fileId = photo.googledrive_id
          photo.destroy();
          const drive = google.drive({ version: 'v3', auth }); // Authenticating drive API
          console.log(KEYFILEPATH)
          console.log(_fileId)
      // Deleting the image from Drive
      drive.files
        .delete({
          fileId: _fileId,
        })
        .then(
          async function (response) {
            res.status(204).json({ status: 'success' });
            return;
          },
          function (err) {
            return res
              .status(400)
              .json({ errors: [{ msg: 'Deletion Failed for some reason' }] });
              return;
          }
        );
        })
      } catch(e){
        res.status(500).send(e.message)
    }
     
    
      
  }
  exports.myProfile = (req, res) => {
    this.userPage(req, res);
  }
  exports.verifyUser = (req, res) => {
    res.status(200).send({userId: req.userId})
  }
  exports.settings = (req, res) => {
    try{
      console.log(req.userId)
      User.findOne({
        where: {
          id: req.body.userId
        }
      }).then(user => {
        user.username = req.body.username
        user.email = req.body.email
        user.save()
        res.status(200).send("User data changed successfully!");
      })
    } catch {
      res.status(500).send()
    }
  }