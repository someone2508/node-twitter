const jwt = require('jsonwebtoken');
const middleware = {};

middleware.verifyToken = (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if(!token)
            return res.status(400).json({
                message: "Invalid access, token is required!"
            });
        
        token = token.replace('Bearer ', '');

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {       // {id}
            if(err) return res.status(400).json({
                message: "Invalid token!"
            });

            req.userId = decoded.id;
            next();
        })
    }
    catch(error) {
        console.log(error);
        res.status(501).json({
            message: "something went wrong, please try again later!"
        })
    }
}

module.exports = middleware;