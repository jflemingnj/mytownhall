/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a sample skill built with Amazon Alexa Skills nodejs
 * skill development kit.
 * This sample supports multiple languages (en-US, en-GB, de-GB).
 * The Intent Schema, Custom Slot and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-howto
 **/

'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = undefined; // TODO replace with your app ID (OPTIONAL).

var mysql = require("mysql");     //npm installed module "mysql"

var databaseCommand = function(cmdString, onResultCallback){
  // Instead of throwing, it would be better to just invoke the callback and provide an error object
  if(typeof cmdString !== "string") throw new err.InputInvalidType({explanation: "'cmdString' is of type '" + typeof cmdString + "', expected type 'string'"});

  console.log('cmdString:' + cmdString);

  var connection = mysql.createConnection({
	  host     : 'mytownhalldb.cckbbirmfdru.us-east-1.rds.amazonaws.com',
	  user     : 'mytownhall',
	  password : 'mytownhallpass',
	  database : 'mytownhalldb',
	  port     : 3306
  });

  connection.query(cmdString, function(error, rows) {
      // Once we have the data, or an error happened, invoke the callback
      console.log('ending connection');
      connection.end();
      console.log('returning');
      onResultCallback(error, rows);
  });
};	

function getLocations(){
	var locations = [];
	locations.push(new Location(0, "the library", "100 branch street", "123-456-7890", "Monday through Friday, 9:00 - 9:00, Saturday, 9:00 - 5:00"));
	locations.push(new Location(1, "the town hall", "100 main street", "732-123-7654", "Monday through Friday, 8:00 - 5:00"));
	return locations;
	
}


function Location(iID, sName, sAddress, sPhone, sHours){
	this.ID = iID;
	this.name = sName;
	this.address = sAddress;
	this.phone = sPhone;
	this.hours = sHours;
}

function Event(iID, sName, sDate, sHours, sDetails){
	this.ID = iID;
	this.name = sName;
	this.date = sDate;
	this.hours = sHours;	
	this.details = sDetails;
}

function QandA(iID, sQuestion, sAnswer){
	this.ID = iID;
	this.question = sQuestion;
	this.answer = sAnswer;
}


function getLocationAnswer(self, question){
        const locationSlot = self.event.request.intent.slots.location;
        var locationName = '';
		var oLocation = null;
        var answer = 'Sorry, we don\'t currently have an answer for the question you asked.';
        var repromptSpeech = self.t('ANSWER_NOT_FOUND_REPROMPT');
        
        if (locationSlot && locationSlot.value) {
            locationName = locationSlot.value.toLowerCase();
        }
        
        if (locationName != ''){
	        const cardTitle = self.t('DISPLAY_CARD_TITLE', self.t('SKILL_NAME'), locationName);
	        console.log('calling getLocationByName');
		  	var queryString = "SELECT la.name, l.* FROM location l inner join location_alias la on l.location_id = la.location_id WHERE la.name = '" + locationName + "'";
		  	var that = self;
		  	var questionType = question;
		  	
		    // This function executes an asynchronous operation so you need to pass in a callback that will be executed once it's done
		    databaseCommand(queryString, function onData(error, dbData) {
		    	
		        console.log('executing DB command');
		      // Once the callback is executed, you call the callback provided to your Lambda function. First argument is an error and the second is payload/result of the operation. First argument should be null if all went ok
		      if (error) {
		        console.log('db returned with error');
		        callback(error);
		      } else {
		        console.log('db returned, no error');
		        if (dbData){
		        	oLocation = dbData[0];
		        	console.log('oLocation:' + JSON.stringify(oLocation));
		        }
		      }
	        if (oLocation) {
		        	answer = eval('oLocation.' + questionType);
		        	console.log('answer:' + answer);
		            repromptSpeech = 'ANSWER_REPEAT_MESSAGE';
		            console.log('emitting answer');
		            
		            that.emit(':tellWithCard', answer, repromptSpeech, cardTitle, answer);
		        } else {		
		            console.log('asking reprompt');		
		            that.emit(':ask', answer, repromptSpeech);
		        }    
		        
				//context.done(null, speechOutput);
	      
	    	});    				
        } else {
            answer = self.t('ANSWER_NOT_FOUND_MESSAGE');
            repromptSpeech = self.t('ANSWER_NOT_FOUND_REPROMPT');

            console.log('asking reprompt');		
            this.emit(':ask', answer, repromptSpeech);
        	
        }	
}

function getValue(sValue){
	return ((sValue != null) && (sValue != undefined))?sValue:'';
}

function isValidDate(dValue){
	return !isNaN(dValue);
}

function getDate(sValue){
	var dateValue = new Date();
	if ((sValue != null) && (sValue != undefined)){
		dateValue = new Date(sValue);
		if (!isValidDate(dateValue)){
			dateValue = new Date();
		}
	}
	return dateValue;
}

function getSpokenDate(date) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];
  
  console.log('gettingSpokenDate:' + date);
  
  var dateValue = new Date(date);
  console.log('dateValue:' + dateValue);
  var day = dateValue.getDate();
  var monthIndex = dateValue.getMonth();
  var year = dateValue.getFullYear();

  return monthNames[monthIndex] + ' ' + day;
}

            
function getEventAnswer(self, question){
        const eventSlot = self.event.request.intent.slots.event;
        var eventName = '';
		var oEvent = null;
        var answer = 'Sorry, we don\'t currently have an answer for the question you asked.';
        var repromptSpeech = self.t('ANSWER_NOT_FOUND_REPROMPT');
        
        if (eventSlot && eventSlot.value) {
            eventName = eventSlot.value.toLowerCase();
        }
        
        if (eventName != ''){
	        const cardTitle = self.t('DISPLAY_CARD_TITLE', self.t('SKILL_NAME'), eventName);
	        console.log('calling getEventByName');
		  	var queryString = "SELECT la.name, l.* FROM event l inner join event_alias la on l.event_id = la.event_id WHERE la.name = '" + eventName + "'";
		  	var that = self;
		  	var questionType = question;
		  	
		    // This function executes an asynchronous operation so you need to pass in a callback that will be executed once it's done
		    databaseCommand(queryString, function onData(error, dbData) {
		    	
		        console.log('executing DB command');
		      // Once the callback is executed, you call the callback provided to your Lambda function. First argument is an error and the second is payload/result of the operation. First argument should be null if all went ok
		      if (error) {
		        console.log('db returned with error');
		        callback(error);
		      } else {
		        console.log('db returned, no error');
		        if (dbData){
		        	oEvent = dbData[0];
		        	console.log('oEvent:' + JSON.stringify(oEvent));
		        }
		      }
		        if (oEvent) {
		        	switch (questionType){
		        		case ('schedule'):
		        			console.log('start_date:' + getSpokenDate(getDate(oEvent.start_date)));
		        			console.log('end_date:' + getSpokenDate(getDate(oEvent.end_date)));
		        			console.log('time:' + oEvent.time);
		        			console.log('frequency:' + oEvent.frequency);
		        			answer = oEvent.name + ' is occurring';
		        			break;
		        		case ('date'):
		        			var endDate = getValue(oEvent.end_date);
		        			var startDate = getDate(oEvent.start_date);
		        			var eventTime = getValue(oEvent.time);
		        			answer = getValue(oEvent.name);
		        			if ((endDate.length > 0) && isValidDate(endDate)){
		        				console.log('getting date range');
		        				answer += ' is running from ' + getSpokenDate(startDate) + ' until ' + getSpokenDate(endDate);
		        			} else {
	        					console.log('getting day');
		        				answer += ' is on ' + getSpokenDate(startDate);
		        			}
		        			if (eventTime.length > 0){
			        			answer += ', at ' + eventTime;		        				
		        			}
		        			break;
	        			default:
				        	answer = eval('oEvent.' + questionType);
				        	console.log('answer:' + answer);
				            repromptSpeech = that.t('ANSWER_REPEAT_MESSAGE');
				            console.log('emitting answer');
		           }
				            
			       that.emit(':tellWithCard', answer, repromptSpeech, cardTitle, answer);
		        } else {		
		            console.log('asking reprompt');		
		            that.emit(':ask', answer, repromptSpeech);
		        } 
		        
				//context.done(null, speechOutput);
	      
	    	});    				
        } else {
            answer = self.t('ANSWER_NOT_FOUND_MESSAGE');
            repromptSpeech = self.t('ANSWER_NOT_FOUND_REPROMPT');

            console.log('asking reprompt');		
            this.emit(':ask', answer, repromptSpeech);
        	
        }	
}

const handlers = {
    //Use LaunchRequest, instead of NewSession if you want to use the one-shot model
    // Alexa, ask [my-skill-invocation-name] to (do something)...
    'LaunchRequest': function () {
        this.attributes['speechOutput'] = this.t("WELCOME_MESSAGE", this.t("SKILL_NAME"));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes['repromptSpeech'] = this.t("WELCOME_REPROMPT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'Unhandled': function() {
		this.emit(':ask', 'Insert your own error message here');
	},
    'LocationAddressIntent': function () {
    	getLocationAnswer(this, 'address');
        
    },
    'LocationHoursIntent': function () {
    	getLocationAnswer(this, 'hours');
    	
    },
    'LocationPhoneIntent': function () {
    	getLocationAnswer(this, 'phone');
    	
    },    
    'EventDetailsIntent': function () {
    	getEventAnswer(this, 'details');
    	
    },    
    'EventLocationIntent': function () {
    	getEventAnswer(this, 'location');
    	
    },    
    'EventScheduleIntent': function () {
    	getEventAnswer(this, 'schedule');
    	
    },    
    'EventDateIntent': function () {
    	getEventAnswer(this, 'date');
    	
    },  
    'EventTimeIntent': function () {
    	getEventAnswer(this, 'time');
    	
    },          
    'EventContactIntent': function () {
    	getEventAnswer(this, 'contact');
    	
    },          
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

const languageStrings = {
    'en-GB': {
        translation: {
            SKILL_NAME: 'My Town Hall',
            WELCOME_MESSAGE: "Welcome to %s. You can ask a question like, what are the hours for the library? or, what\'s the phone number for the town hall? ... Now, what can I help you with.",
            WELCOME_REPROMT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: 'My Town Hall.',
            HELP_MESSAGE: "You can ask questions such as, what are the hours for the library, what\'s the phone number for the town hall, or, you can say exit...Now, what can I help you with?",
            HELP_REPROMT: "You can say things like, what are the hours for the libray, what\'s the phone number for the town hall, or you can say exit...Now, what can I help you with?",
            STOP_MESSAGE: 'Goodbye!',
            ANSWER_REPEAT_MESSAGE: 'Try saying repeat.',
            ANSWER_NOT_FOUND_MESSAGE: "I\'m sorry, I currently do not know ",
           	ANSWER_NOT_FOUND_REPROMPT: 'What else can I help with?',
        },
    },
    'en-US': {
        translation: {
            SKILL_NAME: 'My Town Hall',
            WELCOME_MESSAGE: "Welcome to %s. You can ask a question like, what are the hours for the library? or, what\'s the phone number for the town hall? ... Now, what can I help you with.",
            WELCOME_REPROMT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: 'My Town Hall.',
            HELP_MESSAGE: "You can ask questions such as, what are the hours for the library, what\'s the phone number for the town hall, or, you can say exit...Now, what can I help you with?",
            HELP_REPROMT: "You can say things like, what are the hours for the libray, what\'s the phone number for the town hall, or you can say exit...Now, what can I help you with?",
            STOP_MESSAGE: 'Goodbye!',
            ANSWER_REPEAT_MESSAGE: 'Try saying repeat.',
            ANSWER_NOT_FOUND_MESSAGE: "I\'m sorry, I currently do not know ",
           	ANSWER_NOT_FOUND_REPROMPT: 'What else can I help with?',
        },
    },
};

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};