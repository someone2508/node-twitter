const _ = {};


_.isEmail = function (email) {
    const regeX = /[a-z0-9._%+-]+@[a-z0-9-]+[.]+[a-z]{2,5}$/;
    return regeX.test(email);
};

_.isUserName = function (name) {
    const regeX = /^[a-zA-Z ]+$/;
    return regeX.test(name);
};

_.isPassword = function (password) {
    const regeX = /^(?=.?[A-Z])(?=.?[a-z])(?=.?[0-9])(?=.?[#?!@$%^&*-]).{8,15}$/;
    return regeX.test(password);
};

module.exports = _;