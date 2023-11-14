const mongoose = require('mongoose');

function MongoClient() {

}

MongoClient.prototype.initialize = function () {
    mongoose
        .connect(process.env.LOCAL_DB)
        .then(() => console.log("DB is connected!"))
        .catch(() => console.log("Identified an issue in connecting the DB"))
}

MongoClient.prototype.mongify = function(id) {
    return new mongoose.Types.ObjectId(id);
} 

module.exports = new MongoClient();