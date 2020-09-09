var express             = require("express");
var router              = express.Router();
var AWS                 = require('aws-sdk');
var DynamoDB            = new AWS.DynamoDB();
var DocumentClient      = new AWS.DynamoDB.DocumentClient();
var app                 = express();

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    console.log("posting...");
    console.log(req.body.username);
    console.log(req.body.password);
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err) 
        {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            console.log("No error");
            res.redirect("/campgrounds");
        });
    });
});

/// Login
app.get('/login', function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect('/');   
});

module.exports = router;