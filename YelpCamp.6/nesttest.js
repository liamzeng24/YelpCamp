// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-1'},);
// check the credential
AWS.config.getCredentials(function(err) {
  if (err) console.log(err.stack);
  // credentials not loaded
  else {
    console.log("Access key:", AWS.config.credentials.accessKeyId);
  }
});


// Create the DynamoDB service object
var DynamoDB = new AWS.DynamoDB();
/*
var pararm = {
    TableName: "Camps",
    Key:
    {
        "name" : {S: "Liam's Dytest"},
        "image": {S: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQGMf5RLsxY1VKguLz-6s6bhYUkC3xWrAmG3Q&usqp=CAU"}
        
    },
    ExpressionAttributeValues: 
    {
        ":A":
        {
            S: "He was right, This is indeed a great picture."    
        }
    }
    ,
    UpdateExpression: "SET description = :A"
};

var params = {
    TableName: "Camps",
    Key:
    {
        "name": {S: "Liam's Dytest"},
        "image": {S: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQGMf5RLsxY1VKguLz-6s6bhYUkC3xWrAmG3Q&usqp=CAU"}
    },
    ExpressionAttributeValues:
    {
        ":A":
        {
            S: "Let's see whether this second description can go up there!"    
        }
        
    },
    UpdateExpression: "ADD description = :A"
}
*/

var params = {
    TableName: "Camps",
    Key:
    {
        "name" : {S: "Liam's Dytest"},
        "image": {S: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQGMf5RLsxY1VKguLz-6s6bhYUkC3xWrAmG3Q&usqp=CAU"}
        
    },
    ExpressionAttributeValues: 
    {
        ":A":
        {
            NS: ['12', "11"]
        }
    }
    ,
    UpdateExpression: "ADD comments :A"
}

DynamoDB.updateItem(params, function(err, data){
    if(err) console.log(err, err.stack);
    else console.log(data);
});