const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
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
    
    User.findOne({
      where: {
        id: req.params["userId"]
      }
    }).then(user => {
      if (!user) {
        res.status(400).send({
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
  exports.images = (req, res, userId) => {
    res.status(501).send()
  }