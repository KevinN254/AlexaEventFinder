
var Alexa = require('alexa-sdk');
var request = require('request');

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
   alexa.APP_ID = 'amzn1.ask.skill.852e53f8-0f9f-437f-922c-9aea70b02eea';
  alexa.registerHandlers(handlers);
  alexa.TableName = "session";
  alexa.execute();
};
//var welcomeOutput = "Let's find you an event. In which city would you like me to find you an event?";
//var welcomeReprompt = "Let me know where you'd like me to find you you an event or when you'd like to go to an event";

var handlers = {

  'LaunchRequest': function () {
    this.emit(':ask',"Hello welcome to event finder. Let's find you an event. You can say find me an event in a city on a specific date ");
  },

  'findEventIntent': function() {
    var city = this.event.request.intent.slots.city.value;
    var date = this.event.request.intent.slots.date.value;
    var api_key = "zPszJHPnm5wQMbKp";
    var endpoint = "http://api.eventful.com/json/events/search?app_key=" + api_key +"&location=" + city + "&t=" + date;
    this.attributes["city"] = city;

    //Issue a get request
    request.get(endpoint, (error, response, body) => {
        console.log(error);
        if (response.statusCode !== 200) {
            console.log("There was an error processing your request. Here\'s what happened: " +
            response.statusCode + " " + response.statusCode);
        }
        else{
            //parse the data into the JSON body
            data=JSON.parse(body);
            console.log(body);
            var eventName = data["events"]["event"][0]["title"];
            var city = data["events"]["event"][0]["city_name"];
            var date = data["events"] ["event"][0]["start_time"];
            var date = date.split(" ");
            console.log(date);
            var date = date[0];
            var time = date[1];
            var venue = data["events"]["event"][0]["venue_name"];

            this.emit(':tell', eventName + ' is one of the events that will be on ' + date + ' at ' + venue + ' in ' + city +
            ". Thank you for using event finder stay tuned we are still under development to make your experience better. Hooray!");
        }
    });


  },

  'AMAZON.StopIntent': function () {
    // State Automatically Saved with :tell
    this.emit(':tell', `Goodbye.`);
  },
  'AMAZON.CancelIntent': function () {
    // State Automatically Saved with :tell
    this.emit(':tell', `Goodbye.`);
  },
  'SessionEndedRequest': function () {
    // Force State Save When User Times Out
    this.emit(':saveState', true);
  },

  'AMAZON.HelpIntent' : function () {
    this.emit(':ask', `You can tell me to find an event scheduled to happen in a city in a specific day .  In what city and date would you like me to find you an event?`);
  },
  'Unhandled' : function () {
    this.emit(':ask', `You can tell me to find an event scheduled to happen in a city in a specific day . In what city and date would you like me to find you an event?`);
  }

};