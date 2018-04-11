var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var PostSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true},
    user: {type: Schema.Types.ObjectId, ref:'User'},
    public: {type: Boolean, required: true},
    comment: {type: Schema.Types.ObjectId, ref: 'CommentPost'}
});


var Post = mongoose.model('Post', PostSchema);
module.exports = Post;
