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