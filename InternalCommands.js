var request = require('request');
var apn = require('apn');

var token = "e35a16bed9ba5fcbaade93d110e96a8485ce21c8e1b50e4c6f46ecc50f88c50a"
var options = { };
var apnConnection = new apn.Connection(options);
var myDevice = new apn.Device(token);
var note = new apn.Notification();

var InternalCommands = function(options){
	
};

InternalCommands.prototype = {
	classname: "InternalCommands",
	sendpb: function(args, that){
		console.log("Sending Push Notification...");
			
		request.post(
			'http://api.pushingbox.com/pushingbox',
			{ form: { 'devid': 'v01191CDBCEB612E', 'light' : args } },
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
					console.log(body)
					
					var args = {
						'args' : 'OK'
					};
					
					that.callFunction("callback", args, function (fnResult) {
						
					});
				}
			}
		);
	},
	
	sendapn: function(args, that){
		note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
		note.badge = 0;
		note.sound = "ping.aiff";
		note.alert = "You have a new message: " + args;
		note.payload = {'messageFrom': 'Spark Device'};

		apnConnection.pushNotification(note, myDevice);
	}
};

module.exports = InternalCommands;