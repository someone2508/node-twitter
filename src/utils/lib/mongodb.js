const mongoose = require('mongoose');

function MongoClient() {

}

MongoClient.prototype.initialize = function () {
    mongoose
        .connect(process.env.LOCAL_DB)
        .then(() => console.log("DB is connected!"))
        .catch(() => console.log("Identified an issue in connecting the DB"))
}

module.exports = new MongoClient();