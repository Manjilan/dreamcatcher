var db = require('./models');
db.User.remove({}, function(err, users){
  if (err) {
     console.log(err);
     return;
   }
   console.log("Removed Users");
})
db.CommentPost.remove({}, function(err, users){
  if (err) {
     console.log(err);
     return;
   }
   console.log("Removed Comments");
})
db.Post.remove({}, function(err, users){
  if (err) {
     console.log(err);
     return;
   }
   console.log("Removed Post");
})
