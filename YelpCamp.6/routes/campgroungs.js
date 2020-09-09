var express             = require("express");
var router              = express.Router();
var AWS                 = require('aws-sdk');
var DynamoDB            = new AWS.DynamoDB();
var DocumentClient      = new AWS.DynamoDB.DocumentClient();
var app                 = express();

    app.get("/", function(req, res){
        res.render("index"); 
    });
    
    app.get("/campgrounds", function(req, res){
        DocumentClient.scan({TableName: "Camps"}, function(err, data){
            if(err)
                console.log(err, err.stack);
            else
            {
                res.render("campground", {campgrounds : data.Items, currentUser: req.user});
            }});
    });
    
    app.get("/campgrounds/new", function(req, res){
        res.render("new.ejs");
    });
// work on the post later

    app.post("/campgrounds", function(req, res){
        var new_camp_name = req.body.new_camp_name;
        var image_url = req.body.image_url;
        var new_description = req.body.new_description;
        var new_camp = 
        {
            TableName: "Camps",
            Item:
            {
                "name": new_camp_name, 
                "image": image_url, 
                "description":  new_description,
                "comment_count": '0',
                "comments_ids": [0, 1]
            }
        }
        DocumentClient.put(new_camp, function(err, data){
            if(err) console.log(err. err.stack);
            else console.log(data);
        });
        res.redirect("/campgrounds");
    });
    
module.exports = router;