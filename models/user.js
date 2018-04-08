var mongoose = require('mongoose'),
Schema = mongoose.Schema,
passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
  fullName: { type: String, required: true },
  email: {type: String, required: true },
  password: { type: String, required: true }
});

UserSchema.plugin(passportLocalMongoose);

var User = mongoose.model('User', UserSchema);

module.exports = User;
