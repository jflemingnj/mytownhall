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
	  port     : 3306,
	  multipleStatements : true,
  });

  connection.query(cmdString, function(error, rows) {
      // Once we have the data, or an error happened, invoke the callback
      console.log('closing db connection');
      connection.end();
      
      onResultCallback(error, rows);
  });
};	
            
exports.handler = function(event, context, callback) {
    
  try {
      let response = "";
      console.log('event:' + event);
      let oJSON = JSON.parse(event); //.substr(1,(event.length-1));
      if (oJSON.locations){
      	  var queryString = '';
          var locations = [];
          locations = oJSON.locations; //JSON.parse(event.locations);
          for (var i in locations){
          	let location = locations[i];
          	queryString += "update `location` set `address` = '" + location.address + "',";
          	queryString += "`phone` = '" + location.phone + "',";
          	queryString += "`hours` = '" + location.hours + "'";
          	queryString += "where `location_id` = " + location.location_id + ";";
          }
          console.log('queryString:' + queryString);
          response = queryString;
  	
		    // This function executes an asynchronous operation so you need to pass in a callback that will be executed once it's done
		    databaseCommand(queryString, function onData(error, dbData) {
		    	
		    	//var response = '{"statusCode": 200, "headers": { },"body": "';
		    	//var response = '{"locations": "}';
		    	let response = '';
		        console.log('executing DB command');
		      // Once the callback is executed, you call the callback provided to your Lambda function. First argument is an error and the second is payload/result of the operation. First argument should be null if all went ok
		      if (error) {
		        console.log('db returned with error');
		        context.done(error);
		      } else {
		        console.log('db returned, no error');
		        if (dbData){
		        	for (var i in dbData) {
		        		if (i > 0){
		        			response += ',';
		        		}
			        	response += JSON.stringify(dbData[i]);        		
		        	}
		        }
		      }
		      
		      //response += '"}';
		      context.done(null, response);
		      
		    });
          
      } else {
          console.log("no locations");
          response = "no locations";
      }
      //context.done(null, response);
      
  }
  catch(e) {
    // In case you had an exception in the synchronous part of the code, you still need to invoke the callback and provide an error
    callback(e);
  }
    	  
};