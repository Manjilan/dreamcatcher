var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var CommentSchema = new Schema({
  comment: {type: String},
  user: {type: Schema.Types.ObjectId, ref:'User'},
  post: {type: Schema.Types.ObjectId, ref:'Post'},
});

var CommentPost = mongoose.model('Comment', CommentSchema);

module.exports = CommentPost;
