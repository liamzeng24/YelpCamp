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
var new_table = {
  AttributeDefinitions: [
     {
    AttributeName: "CUSTOMER_ID", 
    AttributeType: "N"
   }, 
     {
    AttributeName: "CUSTOMER_NAME", 
    AttributeType: "S"
   }
  ], 
  KeySchema: [
     {
    AttributeName: "CUSTOMER_ID", 
    KeyType: "HASH"
   }, 
     {
    AttributeName: "CUSTOMER_NAME", 
    KeyType: "RANGE"
   }
  ], 
  ProvisionedThroughput: {
   ReadCapacityUnits: 5, 
   WriteCapacityUnits: 5
  }, 
  TableName: "CUSTOMER_LIST"
 };
 


var params = {
  TableName: 'CUSTOMER_LIST',
  Item: {
    'CUSTOMER_ID' : {N: '001'},
    'CUSTOMER_NAME' : {S: 'Richard Roe'}
  }
};

// Call DynamoDB to add the item to the table
DynamoDB.putItem(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data);
  } 
});
*/

DynamoDB.getItem({
  Key: {
    "CUSTOMER_NAME": {
      S: 'Richard Roe'  
    }
  },
  TableName: "CUSTOMER_LIST"},
  
  function(err, data) {
   if (err) console.log(err, err.stack); // an error occurred
   else     console.log(data);           // successful response
   /*
   data = {
    Item: {
     "AlbumTitle": {
       S: "Songs About Life"
      }, 
     "Artist": {
       S: "Acme Band"
      }, 
     "SongTitle": {
       S: "Happy Day"
      }
    }
   }
   */
 });