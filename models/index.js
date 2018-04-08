var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/dreamcatcher");

module.exports.User = require("./user");
module.exports.Post = require("./journalpost");
