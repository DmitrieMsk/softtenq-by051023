const db = require("../models");
const helper = require("./common");
const User = db.user;
const Post = db.post;
const Relation = db.relation;
const Op = db.Sequelize.Op;
const errorList = [
    "Success",
    "Invalid actorId",
    "Invalid targetId",
    "ActorId and targetId must not be equal",
    "Subscribed",
    "Unsubscribed"
]
async function createIfNotExist(actorId, targetId) {
    return new Promise(resolve => {
        Relation.findOne({
            where:{
                Actor_User_ID: actorId,
                Target_User_ID: targetId
            }
        }).then(relation => {
            if(!relation){
                Relation.create({
                    Actor_User_ID: actorId,
                    Target_User_ID: targetId,
                    IsFriend: false,
                    IsFollowing: false,
                    IsPendingFriendRequest: false,
                    IsBlocked: false,
                    IsHiddenFriend: false
                }).then(_relation => {
                    resolve(_relation);
                    return;
                });
            }
            else{
                resolve(relation);
            }
        });
    })
}
function checkAreIDValid(actorId, targetId) {
    if(!helper.IsDefinedVID(actorId))
        return 1;
    if(!helper.IsDefinedVID(targetId))
        return 2;
    if(actorId == targetId)
        return 3;
    return 0;
}
exports.toggleSubscribe = async (req, res) => {
    actorId = req.body.actorId;
    targetId = req.body.targetId;
    _res = checkAreIDValid(actorId, targetId);
    if(_res != 0){
        res.status(400).send({message: `${errorList[_res]}`});
        return;
    }
    createIfNotExist(actorId, targetId).then(relation => {
        if(helper.IsDefined(relation))
            {
                if(relation.IsFollowing)
                    _res = 5;
                else
                    _res = 4;
                relation.IsFollowing = !relation.IsFollowing;
                relation.save();
                res.status(200).send({message: `${errorList[_res]}`});
                return;
            }
        else {

        }
    });
};