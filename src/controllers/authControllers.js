const {responseHandler} = require('../utils/util');

const register = (req, res, next) => {
    try {
        if(!req.body.email)
            return responseHandler(400, "email is a required field for registration", res); 
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

        return res.status(200).json();
    }
    catch(error) {
        console.log(error);
    }
}

module.exports = {
    register
}