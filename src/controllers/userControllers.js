const Tweet = require("../models/Tweet");
const User = require("../models/User");
const {mongify} = require('../utils/lib/mongodb');


const follow = async (req, res) => {
    try {
        if(!req.userId) return res.status(403).json({
            message: "invalid access!"
        });

        if(!req.body.followUserId) return res.status(401).json({
            message: "followUserId is a required field!"
        });

        const followUser = await User.findOne({_id: mongify(req.body.followUserId)});

        if(!followUser)
            return res.status(404).json({
                message: "Invalid followUserId provided!"
            });
        
        const checkIfAlreadyFollowing = [
            {
                '$match': {
                    _id: mongify(req.body.followUserId) 
                }
            },
            {
                '$unwind': {
                    path: '$aFollowers'
                }
            },
            {
                '$match': {
                    'aFollowers.sUserId': mongify(req.userId)
                }
            }
        ]

        const rs = await User.aggregate(checkIfAlreadyFollowing);

        if(rs.length > 0)
            return res.status(401).json({
                message: "User is already followed!"
            });
        
        // y -> aFollowers -> insert x

        followUser.aFollowers.push({
            sUserId: req.userId
        });

        // x -> aFollowing -> insert y
        // const user = await User.findOne({_id: mongify(req.userId)});
        const user = await User.findById(req.userId);

        user.aFollowing.push({
            sUserId: req.body.followUserId
        });

        await followUser.save();
        await user.save();

        res.status(200).json({
            message: "user followed successfully!"
        });

    }
    catch(error) {
        console.log(error);
        res.status(501).json({
            message: "something went wrong!"
        });
    }
}

const unfollow = async (req, res) => {
    try {
        if(!req.userId) return res.status(403).json({
            message: "Invalid access!"
        });

        if(!req.body.unfollowUserId) return res.status(401).json({
            message: "unFollowUserId is required field!"
        });

        const unfollowUser = await User.findOne({_id: mongify(req.body.unfollowUserId)});
        if(!unfollowUser)
            return res.status(404).json({
                message: "User with given unFollowUserId is not found!"
            });
        
        const ifUserFollowed = [
            {
                '$match': {
                    _id: mongify(req.body.unfollowUserId)
                },
            },
            {
                '$unwind': {
                    path: '$aFollowers'
                }
            },
            {
                '$match': {
                    'aFollowers.sUserId': mongify(req.userId)
                }
            }
        ]

        const rs = await User.aggregate(ifUserFollowed);

        if(rs.length == 0)
            return res.status(401).json({
                message: "User is not yet followed!"
            });

        console.log(unfollowUser);

        const idx1 = unfollowUser.aFollowers.indexOf({sUserId: req.userId});
        unfollowUser.aFollowers.splice(idx1, 1);

        const user = await User.findById(req.userId);
        const idx2 = user.aFollowing.indexOf({userId: req.body.unfollowUserId});
        user.aFollowing.splice(idx2, 1);

        await unfollowUser.save();
        await user.save();

        res.status(200).json({
            message: "user unfollowed successfully!"
        });
    }
    catch(error) {
        console.log(error);
        res.status(501).json({
            message: "Something went wrong!"
        });
    }
}

const getFollowers = async (req, res) => {
    try {
        if(!req.userId) return res.status(403).json({
            message: "Invalid access!"
        });

        const aFollowers = await User.findOne({_id: mongify(req.userId)}, {aFollowers: 1, _id: 0}).populate('aFollowers');

        if(!aFollowers)
            return res.status(401).json({
                message: "Invalid request!"
            });

        res.status(200).json({
            message: "followers retrived successfully!",
            followers: aFollowers
        });
    }
    catch(error) {
        console.log(error);
        res.status(501).json({
            message: "something went wrong!"
        });
    }
}

const deleteMe = async (req, res) => {
    try {
        if(!req.userId) return res.status(403).json({
            message: "Invalid access!"
        });

        const user = await User.findById(req.userId);

        if(!user)
            return res.status(401).json({
                message: "Invalid request!"
            });
        
        await Tweet.updateMany({sUserName: user.sUserName}, {eStatus: 'd'});

        user.eStatus = 'd';
        await user.save();

        return res.status(200).json();
    }
    catch(error) {
        console.log(error);
        return res.status(501).json({
            message: "Something went wrong!"
        });
    }
}

module.exports = {
    follow,
    unfollow,
    getFollowers,
    deleteMe
}