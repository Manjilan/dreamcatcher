
//-----SETUP and CONFIGURATION -------------->

// require express and other modules
var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  $ = require("jquery"),

  //  NEW ADDITIONS
  cookieParser = require("cookie-parser"),
  session = require("express-session"),
  passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;

// configure bodyParser (for receiving form data)
app.use(bodyParser.urlencoded({ extended: true, }));

// serve static files from public folder
app.use(express.static('public'));

// set Models
var db = require('./models'),
  User = db.User,
  CommentPost = db.CommentPost,
  Post = db.Post;

// set view engine to ejs
app.set("view engine", "ejs");

app.use(methodOverride("_method"));

app.use(cookieParser());
app.use(session({
  secret: "thisisasecret", // change this!
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Allow CORS: To reduce security so we can more easily test our code in the browser.
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


//-----ROUTES-------------->


//Homepage
app.get('/', function (req, res) {
    res.render('index', {user: req.user} );
});

//-----Journal Routes---->

//Journal Index
app.get('/api/journalposts', function(req, res){
  Post.find({}, function(err, allPosts){
    if (err){
      console.log(err);
    } else {
      console.log(allPosts);
      res.render('./journalposts/index',{posts: allPosts, user: req.user});
    }
  })
})

//Create journalpost
app.post('/api/journalposts', function(req, res){
  var newPost = new Post(req.body);
  //sanity Check
  console.log(newPost);
  newPost.user=req.user;

  // console.log(req.user);
  newPost.save(function(err, savedPost){
    if (err){
      console.log(err);
    } else {
      console.log(savedPost);
    }
    res.redirect('/api/journalposts');
  })
})

//Show page for a journal post
app.get('/api/journalposts/:id', function(req, res){
  var postId=req.params.id;
  Post.findOne({_id: postId}, function(err, foundPost){
    if (err){
      console.log(err);
    } else {
      var comments=foundPost.id;
      console.log("post found: ", foundPost);
      console.log(comments);
      CommentPost.find({post: comments}, function(err, postComment){
        console.log(postComment);
        res.render('./journalposts/show',{post: foundPost, user: req.user, comments: postComment});
      });
    }

  })
})

//Update a post
app.put('/api/journalposts/:id', function(req, res){
  var postId = req.params.id;
  Post.findOne({_id: postId}, function(err, foundPost){
    if (err){
      console.log(err);
    } else {
      console.log("post found: ", foundPost);
//Updating post
      foundPost.title = req.body.title;
      foundPost.description = req.body.description;
      //foundPost.date = req.body.date;
//Saving the changes
      foundPost.save(function(err, savedPost){
        if (err) {
         res.status(500).json({ error: err.message, });
       } else {
         console.log("Post updated: ", savedPost);
         res.json(savedPost);
       }
      })
    }
  })
})

//Delete a Journal Post
app.delete('/api/journalposts/:id', function(req, res){
  var postId=req.params.id;
  Post.findOneAndRemove({ _id: postId }, function () {
    console.log("Deleted:", postId);
    res.redirect("/api/journalposts", {user: req.user});
  });
})

//---Comment Routes------->

//Comment Index
app.get('/api/comments', function(req, res){
  CommentPost.find({}, function(err, allComments){
    if (err){
      console.log(err);
    } else {
      console.log(allComments);
      res.json(allComments);
    }
  })
})

// Create a comment
app.post('/api/comments', function(req, res){
  console.log(req.body)
  var newComment = new CommentPost(req.body);
  console.log(newComment);
  // console.log(req.params.id);
  // newComment.post=req.params.id;
  newComment.user= req.user;
  console.log(req.body.post_id);
  newComment.post=req.body.post_id;
  newComment.save(function(err, savedComment){
    if (err){
      console.log(err);
    } else {
      console.log("Comment Saved: ", savedComment);
      res.json(savedComment);
    }
  })
})
//delete Comment
app.delete('/api/comments/:id', function(res, req){
  var commentId=req.params.id;
  CommentPost.findOneAndRemove({_id: commentId}, function(err, deletedComment){
    if (err){
      console.log(err);
    } else {
      console.log("Deleted Comment: ", deletedComment);
      res.json(deletedComment);
    }
  })
})

//---User Routes------->

//Users Index
app.get('/users', function(req, res){
  User.find({}, function(err, allUsers){
    if (err){
      console.log(err);
    } else {
      console.log("All Users: ", allUsers);
      res.json(allUsers);
    }
  })
})

//User Show page
// app.get('/users/public/:username', function(req, res){
//   var userId=req.params.username;
//   User.findOne({username: userId}, function(err, foundUser){
//     if (err){
//       console.log(err);
//     } else {
//       console.log("User found: ", foundUser);
//       res.render('userprofile', {user: req.user});
//     }
//   })
// })

//User Profile page
app.get('/users/:id', function(req, res){
  var user=req.user;
  console.log(user);
  Post.find({user: user.id}, function(err, userPosts){
    if (err){
      console.log(err);
    } else {
      res.render('userprofile', {user: req.user, posts: userPosts});
    }
  })
})

// Signup
app.get('/signup', function (req, res) {
 res.render("signup", {user: req.user});
});


app.post("/signup", function (req, res) {
  console.log("sanity check!! pre-signup");
  User.register(new User({ username: req.body.username, }), req.body.password,
      function (err, newUser) {
        console.log("Check if it enter function to auth");
        console.log("ERROR", err);
        console.log("NEW USER!!",newUser);
        passport.authenticate("local")(req, res, function() {
          res.json(newUser);
        });
      }
  );
});

// Login Routes

app.post('/login',passport.authenticate('local'), function (req, res){
  console.log("login successful");
  res.redirect("users/:id");
});

app.get('/login', function(req, res){
  res.render("login", {user: req.user})
});

//LogOut Route
app.get('/logout', function (req, res){
  console.log("Before logout", JSON.stringify(req.user));
  req.logout();
  console.log("After logout", JSON.stringify(req.user));
  res.redirect('/')
});

//Edit User Profile
// create a function to update password
// app.put('/api/users/:id', function(req, res){
//   var userId=req.params.id;
//   User.findOne({_id :userId}, function(err, foundUser){
//     if (err){
//       console.log(err);
//     } else {
//       foundUser.password = req.body.password;
//       res.json(foundUser);
//     }
//   })
// })

//Delete USER
app.delete('/api/users/:id', function(req, res){
  var userId= req.params.id;
  User.findOneAndRemove({_id: userId}, function(err, deletedUser){
    if (err){
      console.log(err);
    } else {
      console.log('User has been deleted: ', deletedUser);
      res.json(deletedUser);
    }
  })
})


//-------------Server------------->
app.listen(process.env.PORT || 3000, function () {
    console.log('Checkout http://localhost:3000/');
});
