const responseHandler = (statusCode, message, res) => {
    return res.status(statusCode).json({
        message
    });
}

module.exports = {
    responseHandler
}