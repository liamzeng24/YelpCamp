var express                 = require("express"),
    app                     = express(),
    AWS                     = require('aws-sdk'),
    DocumentClient          = new AWS.DynamoDB.DocumentClient(),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    LocalStrategy           = require("passport-local"),
    mongoose                = require("mongoose"),
    User                    = require("./models/user");

const uri = "mongodb+srv://Camps:Camps.Password@cluster0.hxvjy.mongodb.net/auth?retryWrites=true&w=majority";

const connectDB = async () =>{
    await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('connected')
};

AWS.config.getCredentials(function(err) {
  if (err) console.log(err.stack);
  // credentials not loaded
  else {
    console.log("Access key:", AWS.config.credentials.accessKeyId);
  }
});

connectDB();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', "ejs");
app.use(require("express-session")({
    secret: "Vanessa is the best wife in the world",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


/*=================================
            ROUTE
===================================
*/


app.get('/', function(req, res){
    res.render("home");
}); 

app.get('/secret', is_logged_in, function(req, res){
    res.render("secret");
});

app.get('/register', function(req, res){
    res.render("register");
});

app.post('/register', function(req, res){
    console.log(req.body.username);
    console.log(req.body.password);
    /*
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err) 
        {
            console.log(err, err.stack);
            return res.render("register");
        }
        else
        {
            passport.authenticate("local")(req, res, function(){
                console.log("No error");
            });
        }
    });*/
    res.send("Post route here");
    console.log("Success");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", 
{
    successRedirect: "/secret",
    failureRedirect: "/login"
}), 
    function(req, res){
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect('/');
});

function is_logged_in(req, res, next){
    if(req.isAuthenticated())
    {
        console.log("yes logged in")
        return next();
    }
    console.log("NG");
    res.redirect('/login');
};

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started");
});