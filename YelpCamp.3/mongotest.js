const express = require("express");
var app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");



const uri = "mongodb+srv://Camps:Camps.Password@cluster0.hxvjy.mongodb.net/test_more?retryWrites=true&w=majority";

const connectDB = async () =>{
    await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('connected');
};

connectDB();
app.use(bodyParser.urlencoded({extended: true}));

var campgroundSchema = new mongoose.Schema({
    name: String,
    age: Number,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);
Campground.create(
    {
        name : "Liam Zeng",
        age: 28,
        image: 'whatever'
        
    }, function(err, campground){
        if(err) console.log(err);
        else
        {
            console.log("Newly created campgound!!!");
            console.log(campground);
        }
        
    });

console.log("all good");



