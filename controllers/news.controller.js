const db = require("../models");
const User = db.user;
const Post = db.post;
const Comment = db.comment;
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

exports.createPost = (req,res) => {
    Post.create({
        Photo_ID: req.body.photoId,
        Owner_ID: req.body.ownerId,
        Views: req.body.views,
        Tags: req.body.tags,
        Publication_Date: Date.now(),
        Comment: req.body.comment,
        Privacy: req.body.privacy,
        Reposted_From_ID: req.body.repostedFrom
      })
      .catch(err => {
        console.log(err.message)
        res.status(500).send("Failed to create the post");
        return;
    });
    res.status(200).send("Created a new post");
}

exports.changePost = (req, res) => {
    try{
            if(req.params["postId"] == undefined || req.params["postId"] === null)
            {
                res.status(500).send("Invalid Id")
                return
            }
            Post.findOne({
            where: {
                id: req.params["postId"]
            }
            }).then(post => {
                if(post === undefined || post === null) {
                    res.status(500).send("Failed to find the post")
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
                res.status(200).send("Changed");
            })
        } catch {
        res.status(500).send()
      }
};
