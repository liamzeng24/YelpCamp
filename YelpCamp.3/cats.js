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
var params = {
  TableName: 'CUSTOMER_LIST',
  Item: {
    'CUSTOMER_ID' : {N: '002'},
    'CUSTOMER_NAME' : {S: 'Liam Daddy'}
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



DynamoDB.getItem(
            {
              TableName: "Camps",
              Key: {name: {S: "Fall is coming"}}
            },
            
            function(err, data)
            {
              if(err) 
                console.log(err, err.stack);
              else
              {
                console.log(data);
              }
            });
    