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
  	var queryString = "SELECT * FROM location_view";
  	
    // This function executes an asynchronous operation so you need to pass in a callback that will be executed once it's done
    databaseCommand(queryString, function onData(error, dbData) {
    	
    	var response = '';
    	//var response = '{"statusCode": 200, "headers": { },"body": "';
    	//var response = '{"locations": "}';
    	//var response = "{'metadata':{'name':'name','label':'Name','datatype':'string','editable':false},{'name':'address','label':'Address','datatype':'string','editable':true},{'name':'phone','label':'Phone','datatype':'string','editable':true},{'name':'hours','label':'Hours','datatype':'string','editable':true}],'data':[";
        console.log('executing DB command');
      // Once the callback is executed, you call the callback provided to your Lambda function. First argument is an error and the second is payload/result of the operation. First argument should be null if all went ok
      if (error) {
        console.log('db returned with error');
        context.done(error);
      } else {
        console.log('db returned, no error');
        if (dbData){
        	response = dbData;
/*        	for (var i in dbData) {
        		if (i > 0){
        			response += ',';
        		}
	        	JSON.stringify(dbData[i]);        		
        	}*/
        }
      }
      
      //response += '}';
      //response = '{"metadata":[{"name":"name","label":"NAME","datatype":"string","editable":true},{"name":"firstname","label":"FIRSTNAME","datatype":"string","editable":true},{"name":"age","label":"AGE","datatype":"integer","editable":true},{"name":"height","label":"HEIGHT","datatype":"double(m,2)","editable":true},{"name":"country","label":"COUNTRY","datatype":"string","editable":true,"values":{"Europe":{"be":"Belgium","fr":"France","uk":"Great-Britain","nl":"Nederland"},"America":{"br":"Brazil","ca":"Canada","us":"USA"},"Africa":{"ng":"Nigeria","za":"South-Africa","zw":"Zimbabwe"}}},{"name":"email","label":"EMAIL","datatype":"email","editable":true},{"name":"freelance","label":"FREELANCE","datatype":"boolean","editable":true},{"name":"lastvisit","label":"LAST VISIT","datatype":"date","editable":true}],"data":[{"id":1, "values":{"country":"uk","age":33,"name":"Duke","firstname":"Patience","height":1.842,"email":"patience.duke@gmail.com","lastvisit":"11\/12\/2002"}},{"id":2, "values":["Rogers","Denise",59,1.627,"us","rogers.d@gmail.com","","07\/05\/2003"]},{"id":3, "values":{"name":"Dujardin","firstname":"Antoine","age":21,"height":1.73,"country":"fr","email":"felix.compton@yahoo.fr","freelance":true,"lastvisit":"21\/02\/1999"}},{"id":4, "values":{"name":"Conway","firstname":"Coby","age":47,"height":1.96,"country":"za","email":"coby@conwayinc.com","freelance":true,"lastvisit":"01\/12\/2007"}},{"id":5, "values":{"name":"Shannon","firstname":"Rana","age":24,"height":1.56,"country":"nl","email":"ranna.shannon@hotmail.com","freelance":false,"lastvisit":"07\/10\/2009"}},{"id":6, "values":{"name":"Benton","firstname":"Jasmine","age":61,"height":1.71,"country":"ca","email":"jasmine.benton@yahoo.com","freelance":false,"lastvisit":"13\/01\/2009"}},{"id":7, "values":{"name":"Belletoise","firstname":"André","age":31,"height":1.84,"country":"be","email":"belletoise@kiloutou.be","freelance":true,"lastvisit":""}},{"id":8, "values":{"name":"Santa-Maria","firstname":"Martin","age":37,"height":1.80,"country":"br","email":"martin.sm@gmail.com","freelance":false,"lastvisit":"12\/06\/1995"}},{"id":9, "values":{"name":"Dieumerci","firstname":"Amédé","age":37,"height":1.81,"country":"ng","email":"dieumerci@gmail.com","freelance":true,"lastvisit":"05\/07\/2009"}},{"id":10,"values":{"name":"Morin","firstname":"Wanthus","age":46,"height":1.77,"country":"zw","email":"morin.x@yahoo.json.com","freelance":false,"lastvisit":"04\/03\/2004"}}]}';
      //response = "{'metadata':[{'name':'name','label':'NAME','datatype':'string','editable':true},{'name':'firstname','label':'FIRSTNAME','datatype':'string','editable':true},{'name':'age','label':'AGE','datatype':'integer','editable':true},{'name':'height','label':'HEIGHT','datatype':'double(m,2)','editable':true},{'name':'country','label':'COUNTRY','datatype':'string','editable':true,'values':{'Europe':{'be':'Belgium','fr':'France','uk':'Great-Britain','nl':'Nederland'},'America':{'br':'Brazil','ca':'Canada','us':'USA'},'Africa':{'ng':'Nigeria','za':'South-Africa','zw':'Zimbabwe'}}},{'name':'email','label':'EMAIL','datatype':'email','editable':true},{'name':'freelance','label':'FREELANCE','datatype':'boolean','editable':true},{'name':'lastvisit','label':'LAST VISIT','datatype':'date','editable':true}],'data':[{'id':1, 'values':{'country':'uk','age':33,'name':'Duke','firstname':'Patience','height':1.842,'email':'patience.duke@gmail.com','lastvisit':'11\/12\/2002'}},{'id':2, 'values':['Rogers','Denise',59,1.627,'us','rogers.d@gmail.com','','07\/05\/2003']},{'id':3, 'values':{'name':'Dujardin','firstname':'Antoine','age':21,'height':1.73,'country':'fr','email':'felix.compton@yahoo.fr','freelance':true,'lastvisit':'21\/02\/1999'}},{'id':4, 'values':{'name':'Conway','firstname':'Coby','age':47,'height':1.96,'country':'za','email':'coby@conwayinc.com','freelance':true,'lastvisit':'01\/12\/2007'}},{'id':5, 'values':{'name':'Shannon','firstname':'Rana','age':24,'height':1.56,'country':'nl','email':'ranna.shannon@hotmail.com','freelance':false,'lastvisit':'07\/10\/2009'}},{'id':6, 'values':{'name':'Benton','firstname':'Jasmine','age':61,'height':1.71,'country':'ca','email':'jasmine.benton@yahoo.com','freelance':false,'lastvisit':'13\/01\/2009'}},{'id':7, 'values':{'name':'Belletoise','firstname':'André','age':31,'height':1.84,'country':'be','email':'belletoise@kiloutou.be','freelance':true,'lastvisit':''}},{'id':8, 'values':{'name':'Santa-Maria','firstname':'Martin','age':37,'height':1.80,'country':'br','email':'martin.sm@gmail.com','freelance':false,'lastvisit':'12\/06\/1995'}},{'id':9, 'values':{'name':'Dieumerci','firstname':'Amédé','age':37,'height':1.81,'country':'ng','email':'dieumerci@gmail.com','freelance':true,'lastvisit':'05\/07\/2009'}},{'id':10,'values':{'name':'Morin','firstname':'Wanthus','age':46,'height':1.77,'country':'zw','email':'morin.x@yahoo.json.com','freelance':false,'lastvisit':'04\/03\/2004'}}]}";
      callback(null, response);
      
    });
  }
  catch(e) {
    // In case you had an exception in the synchronous part of the code, you still need to invoke the callback and provide an error
    callback(e);
  }
    	  
};