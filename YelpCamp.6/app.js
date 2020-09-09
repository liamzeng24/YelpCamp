const   express         = require("express"),
        mongoose        = require("mongoose"),
        app             = express(),
        bodyParser      = require("body-parser"),
        AWS             = require('aws-sdk'),
        passport        = require("passport"),
        LocalStrategy   = require("passport-local"),
        User            = require("./models/user");
        
        
AWS.config.update({region: 'us-east-1'});
app.use(express.static(__dirname + "/public"))
// check the credential
AWS.config.getCredentials(function(err) {
  if (err) console.log(err.stack);
  // credentials not loaded
  else {
    console.log("Access key:", AWS.config.credentials.accessKeyId);
  }
});
var DynamoDB = new AWS.DynamoDB();
var DocumentClient = new AWS.DynamoDB.DocumentClient();


const uri = "mongodb+srv://Camps:Camps.Password@cluster0.hxvjy.mongodb.net/test?retryWrites=true&w=majority";

const connectDB = async () =>{
    await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('connected')
};

connectDB();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
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
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server start"); 
}); 