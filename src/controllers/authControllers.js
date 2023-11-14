const {responseHandler} = require('../utils/util');

const crypto = require('crypto');

const util = require('util');
const scrypt = util.promisify(crypto.scrypt);
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const register = async (req, res, next) => {
    try {
        // if(!req.body.email)
        //     return responseHandler(400, "email is a required field for registration", res); 

        if(!req.body.email)
            return res.json(message.required('email'));   // {code, message}
        if(!req.body.username)
            return responseHandler(400, 'username is a required field for registration', res);
        if(!req.body.password)
            return responseHandler(400, 'password is a required field for registration', res);

        if(!_.isEmail(req.body.email))
            return responseHandler(400, 'given email is not valid!', res);
        
        // if(!_.isPassword(req.body.password))
        //     return responseHandler(400, 'given password is not valid! it must have chars, numbers and atleast 1 special char with a min of 8 and max of 15 leangth', res);
        
        if(!_.isUserName(req.body.username))
            return responseHandler(400, 'given username is not valid!', res);

        const body = {
            email: req.body.email,
            username: req.body.username
        }

        const existingUser = await User.findOne({$or: [{sEmail: body.email}, {sUserName: body.username}]});

        console.log("Exisiting user!");
        console.log(existingUser);

        if(existingUser)
        {
            if(existingUser.sEmail === body.email)
                return responseHandler(400, "email address already in use", res);
            if(existingUser.sUserName === body.username)
                return responseHandler(400, "username is already in use", res);
        }

        const {hashedPassword, salt} = await encyrptPassword(req.body.password);

        body.password = hashedPassword.toString("hex");
        body.salt = salt;

        const newUserDoc = await User.create({
            sUserName: body.username,
            sEmail: body.email,
            sPassword: body.password,
            sSalt: body.salt
        });

        const token = makeToken(newUserDoc._id);

        return res.status(200).json({
            message: "User registered successfully!",
            token
        });
    }
    catch(error) {
        console.log(error);
        return res.status(501).json({
            message: "something went wrong!",
            error
        });
    }
}

const encyrptPassword = async (password) => {
    const salt = crypto.randomBytes(8).toString('hex');
    let hashedPassword = await scrypt(password, salt, 64);
    return {hashedPassword, salt};
}

const makeToken = (id, expTime) => {
    try {
        return jwt.sign({id: id}, process.env.JWT_SECRET);
    }
    catch(error) {
        return error;
    }
}

const login = async (req, res) => {
    try {
        if(!req.body.email) return responseHandler(400, "email is a required field for login!", res);
        if(!req.body.password) return responseHandler(400, "password is a required field for login!", res);

        const body = {
            email: req.body.email,
            password: req.body.password
        }

        const userObj = await User.findOne({sEmail: body.email, eStatus: 'y'});

        if(!userObj)
            return res.status(404).json({
                message: "user with the given email is not found or probably is not active!"
            });

        const rs = await checkPassword(body.password, userObj.sSalt, userObj.sPassword);

        console.log("response!");
        console.log(rs);

        if(!rs)
            return res.status(403).json({
                message: "User with the given email or password is not found!"
            })

        const token = makeToken(userObj._id);
            
        res.status(200).json({
            message: "user logged successfully!",
            token
        });
    }
    catch(error) {
        console.log(error);
        return res.status(501).json({
            message: "something went wrong!",
            error
        });
    }
}

async function checkPassword(password, salt, hashedPassword) {
    const generatedHashedPassword = await scrypt(password, salt, 64);

    return generatedHashedPassword.toString("hex") === hashedPassword;
}

module.exports = {
    register,
    login
}