const { default: mongoose } = require('mongoose');
const User = require('../models/User');
const Tweet = require('../models/Tweet');
const {mongify} = require('../utils/lib/mongodb');

const addTweet = async (req, res) => {
    try {
        if(!req.userId)
            return res.status(400).json({
                message: "user is not authenticated!"
            });
        
        if(!req.body.content)
            return res.status(404).json({
                message: "content is a required field for adding a tweet!"
            });
        
        const user = await User.findOne({_id: mongify(req.userId)});

        if(!user)
            return res.status(403).json({
                message: "access denied, user is invalid!"
            });
        
        const tweetObj = {
            sUserName: user.sUserName,
            sContent: req.body.content
        }

        if(req.body.contentReach === 'followers')
        {
            tweetObj.eContentReach = req.body.contentReach
        }

        const response = await Tweet.create(tweetObj);

        res.status(201).json({
            message: "tweet was created successfully!"
        });
    }
    catch(error) {
        console.log(error);
        res.status(501).json({
            message: "something went wrong!"
        });
    }
} 

const deleteTweet = async (req, res) => {
    try {
        if(!req.userId) return res.status(403).json({
            message: "access denied, user is invalid!"
        });

        if(!req.body.tweetId) return res.status(404).json({
            message: "tweetId is a required field!"
        });

        const user = await User.findOne({_id: mongify(req.userId)});

        if(!user)
            return res.status(404).json({
                message: "access denied, user is invalid or not found!"
            })

        const tweet = await Tweet.findOne({_id: mongify(req.body.tweetId), eStatus: 'y', sUserName: user.sUserName});

        if(!tweet)
            return res.status(404).json({
                message: "An active tweet with the given tweetid and user info not found!"
            })

        await Tweet.deleteOne({_id: mongify(req.body.tweetId)});

        res.status(200).json();
    }
    catch(error) {
        console.log(error);
        res.status(501).json({
            message: "something went wrong!"
        });
    }
}

const likeTweet = async (req, res) => {
    try {
        if(!req.userId) return res.status(403).json({
            message: "access denied, user is not valid!"
        });

        if(!req.body.tweetId) return res.status(404).json({
            message: "tweetId is a required key!"
        });

        // tweet with the tweet id is present or not
        // tweet is active or not
        // if the user has already liked the tweet

        const tweet = await Tweet.findOne({_id: mongify(req.body.tweetId)});

        if(!tweet)
            return res.status(404).json({
                message: "tweet with the given tweet id not found!"
            })

        const checkIfAlreadyLiked = [
            {
                $match: {
                    _id: mongify(req.body.tweetId),
                    eStatus: "y"
                }
            },
            {
                $unwind: {
                    path: "$aLikes"
                }
            },
            {
                $match: {
                    "aLikes.sUserId": mongify(req.userId)
                }
            }
        ]

        const rs = await Tweet.aggregate(checkIfAlreadyLiked);

        if(rs.length > 0)
                return res.status(400).json({
                    message: "the tweet is already liked by the same account!"
                });

            console.log(tweet);

            tweet.aLikes.push({
                sUserId: req.userId
            });

            await tweet.save();

            return res.status(200).json({
                message: "Tweet with the given tweetId is liked successfully!"
            });

    }
    catch(error) {
        console.log(error);
        res.status(501).json({
            message: "something went wrong!"
        })
    }
}


const disLikeTweet = async (req, res) => {
    try {
        if(!req.userId)
            return res.status(403).json({
                message: "invalid access!"
            });
        
        if(!req.body.tweetId)
            return res.status(400).json({
                message: "tweetId is a required field!"
            });
        
        const tweet = await Tweet.findOne({
            _id: mongify(req.body.tweetId),
            eStatus: "y"
        });

        if(!tweet)
            return res.status(404).json({message: "tweet with the given tweetId not found!"});

        const checkIfAlreadyLiked = [
            {
                $match: {
                    _id: mongify(req.body.tweetId),
                    eStatus: "y"
                }
            },
            {
                $unwind: {
                    path: "$aLikes"
                }
            },
            {
                $match: {
                    "aLikes.sUserId": mongify(req.userId)
                }
            }
        ];

        const rs = await Tweet.aggregate(checkIfAlreadyLiked);

        if(rs.length === 0)
            return res.status(400).json({
                message: "the tweet is not yet been liked by the account!"
            });
        
        const idx = tweet.aLikes.indexOf(rs[0]);
        
        tweet.aLikes.splice(idx, 1);

        await tweet.save();

        return res.status(200).json({
            message: "tweet was unliked successfully!"
        });
    }
    catch(error) {
        console.log(error);
        res.status(501).json({
            message: "something went wrong!"
        })
    }
}

const addReTweet = async (req, res) => {
    try {
        if(!req.userId)
            return res.status(403).json({
                message: "invalid access!"
            });
    
        if(!req.body.tweetId)
            return res.status(400).json({
                message: "tweetId is a required field!"
            });
        
        const tweet = await Tweet.findOne({
            _id: mongify(req.body.tweetId),
            eStatus: "y"
        });

        if(!tweet)
            return res.status(404).json({message: "tweet with the given tweetId not found!"});

        const checkIfAlreadyRetweeted = [
            {
                $match: {
                    _id: mongify(req.body.tweetId),
                    eStatus: "y"
                }
            },
            {
                $unwind: {
                    path: "$aRetweeted"
                }
            },
            {
                $match: {
                    "aRetweeted.sUserId": mongify(req.userId)
                }
            }
        ];

        const rs = await Tweet.aggregate(checkIfAlreadyRetweeted);

        if(rs.length > 0)
            return res.status(400).json({
                message: "user has already retweeted on the given tweet!"
            });
        
        tweet.aRetweeted.push({
            sUserId: req.userId
        });

        await tweet.save();

        return res.status(200).json({
            message: "tweet was retweeted successfully!"
        });
    }
    catch(error) {
        console.log(error);
        return res.status(501).json({
            message: "something went wrong!"
        });
    }
}

const deleteRetweet = async (req, res) => {
    try {
        if(!req.userId) return res.status(403).json({
            message: "invalid access!"
        });

        if(!req.body.tweetId)
            return res.status(400).json({
                message: "tweet id is a required field!"
            });


            const tweet = await Tweet.findOne({
                _id: mongify(req.body.tweetId),
                eStatus: "y"
            });
    
            if(!tweet)
                return res.status(404).json({message: "tweet with the given tweetId not found!"});
    
            const checkIfAlreadyRetweeted = [
                {
                    $match: {
                        _id: mongify(req.body.tweetId),
                        eStatus: "y"
                    }
                },
                {
                    $unwind: {
                        path: "$aRetweeted"
                    }
                },
                {
                    $match: {
                        "aRetweeted.sUserId": mongify(req.userId)
                    }
                }
            ];
    
            const rs = await Tweet.aggregate(checkIfAlreadyRetweeted);

        if(rs.length === 0)
            return res.status(400).json({
                message: "retweet for this tweet by the userId is not found!"
            });
        
        const idx = tweet.aRetweeted.indexOf(rs[0]);

        tweet.aRetweeted.splice(idx, 1);

        await tweet.save();

        return res.status(200).json({
            message: "retweet by the user for the given tweet is removed successfully!"
        })
    }
    catch(error) {
        console.log(error);
        return res.status(501).json({
            message: "something went wrong!"
        })
    }
}

const addComment = async (req, res) => {
    try {
        if(!req.userId) return res.status(403).json({
            message: "invalid access!"
        });
        
        if(!req.body.tweetId)
            return res.status(400).json({
                message: "tweetId is a required field!"
            });
        
        if(!req.body.commentContent)
            return res.status(400).json({
                message: "comment content is required!"
            });
        
        const tweet = await Tweet.findOne({_id: mongify(req.body.tweetId), eStatus: 'y'});

        if(!tweet)
            return res.status(404).json({
                message: "tweet with the given tweetId is not found!"
            });
        
        tweet.aComments.push({
            sUserId: req.userId,
            sCommentContent: req.body.commentContent
        });

        await tweet.save();

        return res.status(200).json({
            message: "comment on the given tweet was added successfully!"
        });
    }
    catch(error) {
        console.log(error);
        return res.status(501).json({
            message: "something went wrong!"
        })
    }
}

const deleteComment = async (req, res) => {
    try {
        if(!req.userId)
            return res.status(403).json({
                message: "invalid access!"
            });
        
        if(!req.body.tweetId)
            return res.status(400).json({
                message: "tweetId is a required field!"
            });
        
        if(!req.body.commentId)
            return res.status(400).json({
                message: "commentId is a required field!"
            });
        
        const tweet = await Tweet.findOne({
            _id: mongify(req.body.tweetId),
            eStatus: "y"
        });

        if(!tweet)
            return res.status(404).json({
                message: "tweet with the given tweetId is not found!"
            });
        
        const aggregatePipeline = [
            {
                $match: {
                    _id: mongify(req.body.tweetId),
                    eStatus: "y"
                }
            },
            {
                $unwind: {
                    path: "$aComments"
                }
            },
            {
                $match: {
                    "aComments._id": mongify(req.body.commentId)
                }
            }
        ];

        const rs = await Tweet.aggregate(aggregatePipeline);

        if(rs.length === 0)
            return res.status(404).json({
                message: "comment with the given commentId and tweetId not found!"
            });

        const idx = tweet.aComments.indexOf(rs[0]);

        tweet.aComments.splice(idx, 1);

        await tweet.save();

        return res.status(200).json({
            message: "comment with the given commentId and tweetId was deleted successfully!"
        })
    }
    catch(error) {
        console.log(error);
        return res.status(501).json({
            message: "something went wrong!"
        })
    }
}

module.exports = {
    addTweet,
    deleteTweet,
    likeTweet,
    disLikeTweet,
    addReTweet,
    deleteRetweet,
    addComment,
    deleteComment
}