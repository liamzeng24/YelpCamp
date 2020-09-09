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
var DynamoDB = new AWS.DynamoDB();


var params = {
    TableName: "Camps",
    ExpressionAttributeNames: {
   "#first": "name", 
   "#second": "image"
    }, 
    ProjectionExpression: "#first, #second"
} 

DynamoDB.scan(params, function(err, data){
    if(err)
        console.log(err, err.stack);
    else
        console.log(data);
});