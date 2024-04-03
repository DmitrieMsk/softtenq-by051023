const db = require("../models");
const helper = require("./common");
const User = db.user;
const Post = db.post;
const Comment = db.comment;
const stream = require('stream')
const Like = db.like;

exports.submitLike = (req, res) => {
    const MAX_PARAMS = 2; // change on adding a new param. shows how many different entites can be reacted to with a like(comments, posts, etc*. <--maybe???)
    let paramsProvided = 0, flags = -1;
    let postId = null, commentId = null, actorId;
    let likeJson;
    actorId = req.body.actorId;
    if(!helper.IsDefinedVID(actorId))
    {
        res.status(400).send({message: "Invalid actorId"});
        return;
    }

    if(helper.IsDefined(req.body.postId)) {
        postId = req.body.postId;
        if(!helper.IsVID(postId))
        {
            res.status(400).send({message: "Invalid postId"})
            return;
        }
        flags = 0;
        paramsProvided++;
    }
    if(helper.IsDefined(req.body.commentId)) {
        commentId = req.body.commentId;
        if(!helper.IsVID(commentId))
        {
            res.status(400).send({message: "Invalid commentId"})
            return;
        }
        flags = 1;
        paramsProvided++;
    }
    if(paramsProvided == 0){
        res.status(400).send({message: "The ID of the like's target hasn't been provided"});
        return;
    }
    if(paramsProvided > 1) {
        res.status(400).send({message: "Ambiguous request: multiple params were sent"});
        return;
    }

    Like.destroy({
        where: {
            Actor_ID: actorId,
            Post_ID: postId,
            Comment_ID: commentId
        }
    }).then(function (deletedRecord) {
        if(deletedRecord === 1){
            res.status(200).json({message:"Like has been removed"});
            return;          
        } else {
            Like.create({
                Actor_ID: actorId,
                Post_ID: postId,
                Comment_ID: commentId
            })
            .catch(err => {
                console.log(err.message)
                res.status(500).send({message: "Failed to like"});
                return;
            });
            res.status(200).send({message: "Like submitted"});
            return;
        }
    });
    
    
}

exports.getLikeCount = (req, res) => {
    try{
        let postId = req.params["postId"];
        if(!helper.IsDefinedVID(postId)) {
            res.status(400).send({message: "Invalid postId"});
            return;
        }
        let likesArray = [];
        Like.findAll({
            where: {
                Post_ID: postId
            }
        }).then(likes => {
            if(!likes){
                res.status(400).send({message: "This post haven't got any likes"});
                return;
            } else {
                likes.forEach((like) => {
                    let likeJson = {
                        likeId: like.id,
                        actorId: like.Actor_ID
                    }
                    likesArray.push(likeJson);
                })
                res.status(200).send(likesArray);
                return;
            }
        })
    } catch (e) {
        res.status(500).send({message: "Congratulations! You've managed to successfully bypass all safety measures and crash backend app."});
        return;
    }
}

exports.createComment = (req, res) => {
    let actorId = req.body.actorId;
    let topicId = req.body.topicId;
    let text = req.body.commentContent;
    let isReply = req.body.isReply;

    if(!helper.IsDefinedVID(actorId)) {
        res.status(400).send({message: "Invalid actorId"});
        return;
    }

    if(!helper.IsDefinedVID(topicId)) {
        res.status(400).send({message: "Invalid topicId"});
        return;
    }

    if(!helper.IsDefined(text))
    {
        res.status(400).send({message: "Invalid commentContent"});
        return;
    }

    if(text.length == 0) {
        res.status(400).send({message: "#ERR#: Empty comment"});
        return;
    }


    if(!helper.IsDefined(isReply))
        isReply = false;

    Comment.create({
        Actor_ID: actorId,
        Topic_ID: topicId,
        Text: text,
        IsReply: isReply,
        Publication_Date: Date.now()
    })
    .catch(err => {
        console.log(err.message)
        res.status(500).send({message: "Failed to create a comment"});
        return;
    });
    res.status(200).send({message: "Comment created"});
    return;
}


exports.getComment = (req, res) => {
    Comment.findOne({
        where: {
          id: req.params["commentId"]
        }
      }).then(comment => {
        if (!comment) {
          res.status(404).send({
            message: "Failed! Comment doesn't exist!"
          });
          return;
        }
        else{
          res.status(200).send({
            id: comment.id,
            topicId: comment.Topic_ID,
            actorId: comment.Actor_ID,
            commentContent: comment.Text,
            isReply: comment.IsReply,
            publicationDate: comment.Publication_Date,
          });
        }
      });
}