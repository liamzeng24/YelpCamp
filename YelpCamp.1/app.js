var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
// check the credential
AWS.config.getCredentials(function(err) {
  if (err) console.log(err.stack);
  // credentials not loaded
  else {
    console.log("Access key:", AWS.config.credentials.accessKeyId);
  }
});

var DynamoDB = new AWS.DynamoDB();

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


    app.get("/", function(req, res){
        res.render("home"); 
    });
    
    app.get("/campgrounds", function(req, res){
        var cur = []; 
        DynamoDB.scan({TableName: "Camps"}, function(err, data){
            if(err)
                console.log(err, err.stack);
            else
            {
                data.Items.forEach(function(item)
                {
                   cur.push({'name': item.name.S, 'image': item.image.S}); 
                });
                res.render("campground", {campgrounds : cur});
            }});
    });
    
    app.get("/campgrounds/new", function(req, res){
        res.render("new.ejs");
    });
// work on the post later

    app.post("/campgrounds", function(req, res){
        var new_camp_name = req.body.new_camp_name;
        var image_url = req.body.image_url;
        var new_camp = 
        {
            TableName: "Camps",
            Item:
            {
                "name": {S: new_camp_name}, "image": {S: image_url}  
            }
        }
        DynamoDB.putItem(new_camp, function(err, data){
            if(err) console.log(err. err.stack);
            else console.log(data);
        });
        res.redirect("/campgrounds");
    });
    
    app.get("/campgrounds/:id", function(req, res){
        res.render("show");
    });


// schema setup:
 /*
 DynamoDB.createTable(new_table, function(err, data) {
   if (err) console.log(err, err.stack); // an error occurred
   else     console.log(data);           // successful response
 });

*/


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server start"); 
});