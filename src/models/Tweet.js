const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
    sUserName: {
        type: String,
        require: [true, 'username is a required field for tweet!']
    },
    sContent: {
        type: String,
        require: [true, 'content is a required feld for tweet!'],
        minLength: [5, 'a minimum of 5 chars is required for the tweet!'],
        maxLength: [500, 'no more then 500 chars are allowed for the tweet!']
    },
    eContentReach: {
        type: String,
        enum: ['everyone', 'followers'],
        default: 'everyone'
    },
    aLikes: [
        {
            sUserId: {
                type: mongoose.Schema.ObjectId,
                ref: 'users',
                require: [true, 'user id is a required field for likes']
            }
        }
    ],
    aRetweeted: [
        {
            sUserId: {
                type: mongoose.Schema.ObjectId,
                ref: 'users',
                require: [true, 'user id a required field for retweets']
            }
        }
    ],
    aComments: [
        {
            sUserId: {
                type: mongoose.Schema.ObjectId,
                ref: 'users',
                require: [true, 'user id a required field for comments']
            },
            sCommentContent: {
                type: String,
                require: [true, 'comment content is required for adding a comment!'],
                minLength: [5, 'comment must be atleast of 5 chars'],
                maxLength: [200, 'comment must not be more then 200 chars']
            }
        }
    ],
    eStatus: {
        type: String,
        enum: ["y", "n", "d"],       // y = active, n = blocked  d = deleted
        default: "y"
    }
}, {
    timeStamps: true
});

modules.exports = mongoose.model('Tweet', tweetSchema);