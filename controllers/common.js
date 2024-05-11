require('dotenv').config();
const config = process.env;

const nodemailer = require("nodemailer");
const crypto = require('crypto');
const db = require("../models");
const Like = db.like;
const backendAddress = config.BACKENDURL
const frontendAddress = config.FRONTENDURL
const transporter = nodemailer.createTransport({
    host: "smtp.yandex.ru",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "softenq030524@yandex.ru",
      pass: "mgefmoctcikpzafe",
    },
  });
const common = {};
function sha256(buf) {
    const hash = crypto.createHash('sha256');
    hash.update(buf);
    return hash.digest('hex');
  }
const INT_MAX = 2147483647;
DEFAULT_PHOTOLINK = "1VgCxxUp0H8x3o5_tuvG-9q9w8Psg36UY";
const PHOTOFLAGS = {
    GLOBAL: -1,
    GALLERY: 0,
    POST : 1
};
const SEARCHFLAGS = {
    POST: 0,
    COMMENT: 1
}

IsDefined = (value) => {
    return (value !== undefined && value !== null);
}

IsUInt = (value) => {
    return (Number.isInteger(value) && value < INT_MAX && value >= 0);
}

IsVID = (value) => {
    return (value < INT_MAX && value > 0);
}

common.IsDefined = IsDefined;

common.IsVID = IsVID;

common.IsUInt = IsUInt;

common.IsDefinedUInt = (value) => {
    return (IsDefined(value) && IsUInt(value));
}

common.IsDefinedVID = (value) => {
    return (IsDefined(value) && IsVID(value));
}

common.IsDefinedInt = (value) => {
    return (IsDefined(value) && Number.isInteger(value));
}

common.GetProfilePicture = (value) => {
    return (IsDefined(value) ? value : DEFAULT_PHOTOLINK);
}

function destroyLikes(commentId, postId)
{
  _status = -2;
  searchParam = {};
  if(!IsDefined(commentId) && !IsDefined(postId))
    return _status;
  _status++;
  if(IsDefined(commentId) && IsDefined(postId))
    return _status;
  _status++;
  Like.findAll({
    where: {
      Comment_ID: commentId,
      Post_ID: postId
    }
  }).then(likes => {
    likes.forEach(like => {
      like.destroy();
      _status++;
    });
    return _status;
  })
} 

common.DB_INT_MAX = INT_MAX;
common.PHOTOFLAGS = PHOTOFLAGS;
common.DEFAULT_PHOTOLINK = DEFAULT_PHOTOLINK;
common.SEARCHFLAGS = SEARCHFLAGS;
common.NODEMAILER = nodemailer;
common.TRANSPORTER = transporter;
common.ENCRYPT = sha256;
common.LOCALADDR = backendAddress;
common.REMADDR = frontendAddress;
common.DESTROYLIKES = destroyLikes;
module.exports = common;