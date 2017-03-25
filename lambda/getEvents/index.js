'use strict';

var mysql = require("mysql");     //npm installed module "mysql"

var databaseCommand = function(cmdString, onResultCallback){
  // Instead of throwing, it would be better to just invoke the callback and provide an error object
  if(typeof cmdString !== "string") throw new err.InputInvalidType({explanation: "'cmdString' is of type '" + typeof cmdString + "', expected type 'string'"});

  var connection = mysql.createConnection({
	  host     : 'mytownhalldb.cckbbirmfdru.us-east-1.rds.amazonaws.com',
	  user     : 'mytownhall',
	  password : 'mytownhallpass',
	  database : 'mytownhalldb',
	  port     : 3306
  });

  connection.query(cmdString, function(error, rows) {
      // Once we have the data, or an error happened, invoke the callback
      console.log('closing db connection');
      connection.end();
      onResultCallback(error, rows);
  });
};	
            
exports.handler = function(event, context, callback) {

	context.callbackWaitsForEmptyEventLoop = false;
    
  try {
  	var queryString = "SELECT * FROM event_view";
  	
    // This function executes an asynchronous operation so you need to pass in a callback that will be executed once it's done
    databaseCommand(queryString, function onData(error, dbData) {
    	
    	var response = '';
        console.log('executing DB command');
      // Once the callback is executed, you call the callback provided to your Lambda function. First argument is an error and the second is payload/result of the operation. First argument should be null if all went ok
      if (error) {
        console.log('db returned with error');
        context.done(error);
      } else {
        console.log('db returned, no error');
        if (dbData){
        	response = dbData;
        }
      }
      
      callback(null, response);
      
    });
  }
  catch(e) {
    // In case you had an exception in the synchronous part of the code, you still need to invoke the callback and provide an error
    callback(e);
  }
    	  
};