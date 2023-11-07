const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    sUserName: {
        type: String,
        unqiue: [true, 'username should be unique!'],
        require: [true, "username is a required key!"]
    },
    sEmail: {
        type: String,
        unqiue: [true, 'email should be unique!'],
        require: [true, 'email is a required field!']
    },
    sPassword: {
        type: String,
        require: [true, 'password is a required key!']
    },
    oName: {
        sFirstName: String,
        sLastName: String
    },
    sRole: {
        type: String,
        enum: ['user', 'admin'],
        default: "user"
    },
    aFollowing: [
        {
            sUserId: {
                type: mongoose.Schema.ObjectId,
                ref: 'users',
                require: [true, 'userId is a required field!']
            }
        }
    ],
    aFollowers: [
        {
            sUserId: {
                type: mongoose.Schema.ObjectId,
                ref: 'users',
                require: [true, 'userId is a required field!']
            }
        }
    ],
    sSalt: {
        type: String,
        require: [true, 'salt is a required field!']
    },
    eStatus: {
        type: String,
        enum: ["y", "n", "d"],   // y=active, n=blocked, d=deleted
        default: "y"
    },
    sProfilePicUrl: {
        type: String,
        default: ''
    },
    bIsUserVerified: {
        type: Boolean,
        default: false
    },
    bIsEmailVerified: {
        type: Boolean,
        default: false
    },
    sResetPasswordToken: String,
    sResetPasswordExpiresIn: String,
    sVerifyEmailToken: String,
    sVerifyEmailTokenExpiresIn: String
}, {
    timeStamps: true
});

module.exports = mongoose.model('User', userSchema);