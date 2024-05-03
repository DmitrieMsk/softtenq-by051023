const db = require("../models");
const helper = require("./common");
const User = db.user;
const Post = db.post;
const Comment = db.comment;
const stream = require('stream')
const Like = db.like;

const Op = db.Sequelize.Op;
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

exports.changeComment = (req, res) => {
    let commentId = req.params["commentId"];
    let text = req.body.commentContent;
    if(!helper.IsDefined(commentId)){
      res.status(400).send({message: "Invalid commentId"});
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
    try{
        Comment.findOne({
            where: {
                id: commentId
            }
        }).then(comment => {
            if(!helper.IsDefined(comment)) {
                res.status(500).send({message: "Failed to find the comment"})
                return
            }
            comment.Text = text;

            comment.save()
            res.status(200).send({message: "Changed"});
        })
        } catch (e){
        res.status(500).send({message: "Congratulations! You've managed to successfully bypass all safety measures and crash backend app."});
    }
  };


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

exports.getLiked = (req, res) => {
    let userId = req.params["userId"];
    let flags = req.body.flags;
    let searchParam;

    if(!helper.IsDefinedUInt(flags)) {
        res.status(400).send({message: "Invalid flags"});
        return;
    }
    
    switch(flags){
        case helper.SEARCHFLAGS.POST:
            searchParam = {
                where: {
                    Actor_ID: userId,
                    Post_ID: {
                        [Op.ne]: null
                    }
                }
            }
            
            break;  
        case helper.SEARCHFLAGS.COMMENT:
            searchParam = {
                where: {
                    Actor_ID: userId,
                    Comment_ID: {
                        [Op.ne]: null
                    }
                }
            }
            break;          
        default:            
            res.status(400).send({message: "Unknown flags"});
            return;
    }
    let likesArray = [];
    Like.findAll(searchParam).then(likes => {
        if (!likes) {
          res.status(400).send({
            message: "Not found"
          });
          return;
        } else {
          likes.forEach((like) => {
            let likeJson = {
                id: like.id,
                postId: like.Post_ID,
                commentId: like.Comment_ID
            };
            likesArray.push(likeJson);
          });
          res.status(200).send(likesArray);
          return;
        }
      });
}

exports.getAllComments = (req, res) => {
    try{
        let topicId = req.params["topicId"];
        let isReply = false;
        if(req.body.isReply)
            isReply = true;
        let commentsArray = [];
        Comment.findAll({
            where: {
                Topic_ID: topicId,
                IsReply: isReply
            }
        }).then(comments => {
            if(!comments){
                res.status(400).send({message: "This topic haven't got any comments"});
                return;
            } else {
                comments.forEach((comment) => {
                    let commentJson = {
                        commentId: comment.id,
                        actorId: comment.Actor_ID,
                        commentContent: comment.Text,
                        publicationDate: comment.Publication_Date
                    }
                    commentsArray.push(commentJson);
                })
                res.status(200).send(commentsArray);
                return;
            }
        })
    } catch (e) {
        res.status(500).send({message: "Congratulations! You've managed to successfully bypass all safety measures and crash backend app."});
        return;
    }
}

exports.getAllUserComments = (req, res) => {
    try{
        let userId = req.params["userId"];
        let commentsArray = [];
        Comment.findAll({
            where: {
                Actor_ID: userId
            }
        }).then(comments => {
            if(!comments){
                res.status(400).send({message: "This user haven't got any comments"});
                return;
            } else {
                comments.forEach((comment) => {
                    let commentJson = {
                        commentId: comment.id,
                        topicId: comment.Topic_ID,
                        isReply: comment.IsReply,
                        commentContent: comment.Text,
                        publicationDate: comment.Publication_Date
                    }
                    commentsArray.push(commentJson);
                })
                res.status(200).send(commentsArray);
                return;
            }
        })
    } catch (e) {
        res.status(500).send({message: "Congratulations! You've managed to successfully bypass all safety measures and crash backend app."});
        return;
    }
}

exports.deleteComment = (req, res) => {
    commentId = req.params["commentId"];
    if(!helper.IsVID(commentId))
        {
            res.status(400).send({message: "Invalid commentId"});
            return;
        }
    try{
        Comment.findOne({
        where: {
            id: commentId
        }}).then(comment => {
            if(!helper.IsDefined(comment)) {
                res.status(500).send({message:"Failed to find the comment"})
                return;
            }
            comment.destroy();
            helper.DESTROYLIKES(null, commentId);
            Comment.findAll({
                where: {
                    Topic_ID: commentId,
                    IsReply: true
                }
            }).then(comments => {
                comments.forEach(_comment => {
                    _commentId = _comment.id;
                    _comment.destroy();
                    helper.DESTROYLIKES(null, _commentId);
                })
            })
        })
        res.status(200).send({message: "Deleted!"});
        return;
        } catch(e){
        res.status(500).send({message: "Congratulations! You've managed to successfully bypass all safety measures and crash backend app."})
        return;
    }
    }