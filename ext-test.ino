#include "application.h"

// Spark functions
int sendpb(String args);
int sendapn(String args);
int callback(String args);

void setup() {
	Serial.begin(9600);

	pinMode(D7, OUTPUT);

	// Define functions
	Spark.function("sendpb", sendpb);
	Spark.function("sendapn", sendapn);
	Spark.function("callback", callback);
}

void loop(){

}

// Send Pushing Box
int sendpb(String args){
	Serial.println(args);

	Spark.publish("cmds/sendpb", args);

	return 1;
}

// Send Apple Push Notification
int sendapn(String args){
	Serial.println(args);

	Spark.publish("cmds/sendapn", args);

	return 1;
}

// Callback function from the Spark Cloud
int callback(String args){

	Serial.println("Callback from server with args " + args);

	digitalWrite(D7, HIGH);
	delay(500);
	digitalWrite(D7, LOW);
	delay(500);

	return 1;
}
