const db = require("../models");
const helper = require("./common");
const User = db.user;
const Post = db.post;
const Comment = db.comment;
const stream = require('stream')
const Like = db.like;
/*
exports.getPost = (req, res) => {

};
*/
exports.getPost = (req, res) => {
    Post.findOne({
        where: {
          id: req.params["postId"]
        }
      }).then(post => {
        if (!post) {
          res.status(404).send({
            message: "Failed! Post doesn't exist!"
          });
          return;
        }
        else{
          res.status(200).send({
            id: post.id,
            photoId: post.Photo_ID,
            ownerId: post.Owner_ID,
            views: post.Views,
            tags: post.Tags,
            publicationDate: post.Publication_Date,
            comment: post.Comment,
            privacy: post.Privacy,
            repostedFrom: post.Reposted_From_ID
          });
        }
      });
};

exports.createPost = async (req,res) => {
  if(!helper.IsDefinedUInt(req.body.ownerId)){
    res.status(400).send({message: "Invalid ownerId"});
    return;
  }
  if(helper.IsDefined(req.body.repostedFrom))
  {
    if(!helper.IsUInt(req.body.repostedFrom))
      {
        res.status(400).send({message: "Invalid repostedFrom"});
        return;
      }
  }
  if(helper.IsDefined(req.body.privacy))
  {
    if(!helper.IsUInt(req.body.privacy))
      {
        res.status(400).send({message: "Invalid privacy Flags"});
        return;
      }
  }
  if(!helper.IsDefined(req.body.privacy)){
    req.body.privacy = 0;
  }
  let photoId = req.body.photoId;
  if(!helper.IsDefined(photoId))
  {
    const type = "image"
    const {body, files} = req
    if(!helper.IsDefined(files)){
      res.status(400).send({message: "No photos provided"});
      return;
    }
    let file = files[0]
    if(!helper.IsDefined(file) || file.mimetype.substring(0,5) != type){
      res.status(400).send({message: "Invalid photo"});
      return;
    }
    const bufferStream = new stream.PassThrough()
    bufferStream.end(fileObject.buffer)
    const {data} = await google.drive({
        version: 'v3',
        auth
    }).files.create({
      media:{
          mimeType: fileObject.mimetype,
          body: bufferStream
      },
      requestBody: {
          name: fileObject.originalname,
          parents: folderID
      },
      fields: "id,name"
    });
    
    const photo = UserLinksPhoto.create({
      user_id: req.body.ownerId,
      googledrive_id: data.id
    })
    .catch(err => {
      console.log(err.message)
      res.status(500).send({message: "Error occured while saving photo to the database."});
      return;
    })

    photoId = photo.id;
  } else {
    if(!helper.IsUInt(photoId))
      {
        res.status(500).send({message: "Invalid photoId has been provided"});
        return;
      }
  }
    
  
  

    Post.create({
        Photo_ID: photoId,
        Owner_ID: req.body.ownerId,
        Views: 0,
        Tags: req.body.tags,
        Publication_Date: Date.now(),
        Comment: req.body.comment,
        Privacy: req.body.privacy,
        Reposted_From_ID: req.body.repostedFrom
      })
      .catch(err => {
        console.log(err.message)
        res.status(500).send({message: "Failed to create the post"});
        return;
    });
    res.status(200).send({message: "Created a new post"});
}

exports.changePost = (req, res) => {
  if(!helper.IsDefinedUInt(req.body.photoId)){
    res.status(400).send({message: "Invalid photoId"});
    return;
  }
  if(helper.IsDefined(req.body.privacy))
  {
    if(!helper.IsUInt(req.body.privacy) )
      {
        res.status(400).send({message: "Invalid privacy Flags"});
        return;
      }
  }
  if(!helper.IsDefined(req.body.privacy)){
    req.body.privacy = 0;
  }
  if(!helper.IsDefinedUInt(req.body.viewsDifference)){
    req.body.viewsDifference = 0;
  }
    try{
            if(!helper.IsDefined(req.params["postId"]))
            {
                res.status(400).send({message: "Invalid Id"})
                return
            }
            Post.findOne({
            where: {
                id: req.params["postId"]
            }
            }).then(post => {
                if(!helper.IsDefined(post)) {
                    res.status(500).send({message: "Failed to find the post"})
                    return
                  }
                post.Photo_ID = req.body.photoId;
                post.Views += req.body.viewsDifference
                if(post.Views < 0)
                    post.Views = 0;
                post.Tags = req.body.tags;
                post.Comment = req.body.comment;
                post.Privacy = req.body.privacy;

                post.save()
                res.status(200).send({message: "Changed"});
            })
        } catch (e){
        res.status(500).send({message: "Unknown error"});
      }
};

exports.feed = (req, res) => {
  if(!helper.IsDefinedInt(req.body.flags)){
    res.status(400).send({message: "Invalid flags"});
    return;
  }
  if(!helper.IsDefinedUInt(req.body.startingPoint)){
    res.status(400).send({message: "Invalid startingPoint"});
    return;
  }
  if(!helper.IsDefinedUInt(req.body.postsCount)){
    res.status(400).send({message: "Invalid postsCount"});
    return;
  }
  try{
    let flags = req.body.flags;
    let startingPoint = req.body.startingPoint;
    let postsCount = req.body.postsCount;
    let order = undefined;
    switch(flags){
      //Date sorted search
      case 0:
          order = [["Publication_Date", "DESC"]]
        break;
      //Views sorted search
      case 1:
        order = [["Views", "DESC"]]
        break;
      default:
        throw("Invalid flags");
    
    }
    Post.findAll({
      limit: postsCount,
      offset: startingPoint,
      order: order
    }).then(posts => {
      let postsArray = [];
      posts.forEach((post) => {
        let postJson = {
          id: post.id,
          photoId: post.Photo_ID,
          ownerId: post.Owner_ID,
          views: post.Views,
          tags: post.Tags,
          publicationDate: post.Publication_Date,
          comment: post.Comment,
          privacy: post.Privacy,
          repostedFrom: post.Reposted_From_ID
        }
        postsArray.push(postJson)
      });
      res.status(200).send(postsArray);
    });
  } catch (e) {
    res.status(500).send({message: e.message});
  }

}

exports.getUserPosts = (req, res) => {
  if(!helper.IsDefinedInt(req.body.flags)){
    res.status(400).send({message: "Invalid flags"});
    return;
  }
  if(!helper.IsDefinedUInt(req.body.startingPoint)){
    res.status(400).send({message: "Invalid startingPoint"});
    return;
  }
  if(!helper.IsDefinedUInt(req.body.postsCount)){
    res.status(400).send({message: "Invalid postsCount"});
    return;
  }
  if(!helper.IsDefinedUInt(req.params["userId"])){
    res.status(400).send({message: "Invalid userId"});
    return;
  }
  try{
    let flags = req.body.flags;
    let startingPoint = req.body.startingPoint;
    let postsCount = req.body.postsCount;
    let order = undefined;
    switch(flags){
      //Date sorted search
      case 0:
          order = [["Publication_Date", "DESC"]]
        break;
      //Views sorted search
      case 1:
        order = [["Views", "DESC"]]
        break;
      default:
        throw("Invalid flags");
    
    }
    Post.findAll({
      where: {
        id: req.params["userId"]
      },
      limit: postsCount,
      offset: startingPoint,
      order: order
    }).then(posts => {
      let postsArray = [];
      posts.forEach((post) => {
        let postJson = {
          id: post.id,
          photoId: post.Photo_ID,
          ownerId: post.Owner_ID,
          views: post.Views,
          tags: post.Tags,
          publicationDate: post.Publication_Date,
          comment: post.Comment,
          privacy: post.Privacy,
          repostedFrom: post.Reposted_From_ID
        }
        postsArray.push(postJson)
      });
      res.status(200).send(postsArray);
    });
  } catch (e) {
    res.status(500).send({message: e.message});
  }

}
