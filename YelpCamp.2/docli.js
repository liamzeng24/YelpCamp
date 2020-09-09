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
var DocumentClient = new AWS.DynamoDB.DocumentClient();

var params = {
    TableName: "Camps",
    Key: {name: "Fall is coming"}
};

DocumentClient.get(params, function(err, data){
    if(err) console.log(err, err.stack);
    else console.log(data);
});


DocumentClient.get(
            {
                TableName: "Camps",
                Key: {name: "Fall is coming"}
            }, function(err, data)
            {
                if(err) 
                {
                    console.log(err, err.stack);
                }
                else
                {
                    console.log(data.Item);
                    //res.render("show", {camp_detail: data.Items});
                }
            });