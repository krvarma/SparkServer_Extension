Extending or Customizing Spark Server
----------------------

First I want to thank @Dave for providing his insight on the Spark Cloud. Thank you @Dave!.

Here is a project I worked this week to extend Spark Server. I have Spark Server running on my Raspberry PI and was thinking about adding some custom functionality to it. As a first step I thought to add functionality to send Push Notification from Spark Server itself. There are many other methods to achieve this but from Spark Server itself will be an advantage.

While looking at the Spark Server source code, I found one point where we can safely place code to extend Spark Cloud. The file *SparkCore.js* has one function called *onCoreSentEvent*.  Here the Spark Server is processing the internal "*spark/cc3000-patch-version*" event. The [Line No. 1025](https://github.com/spark/spark-protocol/blob/master/js/clients/SparkCore.js#L1025) starts the processing of internal event. I thought of the same method to extend Spark Server to include some custom functionality. This is a point where we can insert our own code safely and without breaking anything. 

The idea is to publish some events from Spark Core and at the *onCoreSentEvent* function check for this internal events and process based on the event name. I created a sample based on this to send Push Notification using Apple Push Notification Service and Pushing Box. From Spark Core if we send an event *cmds/sendpb*, it will send notification using Pushing Box and if the event is *cmds/sendapn*, it will send using Apple Push Notification service. To send Apple Push Notification, I am using this [Node.js library](https://github.com/argon/node-apn) by [Andrew Nayler (@argon)](https://github.com/argon). Here is the code that handles the internal events, the code is inserted before [Line No. 1026](https://github.com/spark/spark-protocol/blob/master/js/clients/SparkCore.js#L1026)

    .
    .
    .
    // Copy this code and insert it before line no. 1026 of the SparkCore.js file.
    // COPY START
    if(lowername.indexOf("cmds") == 0){
		this.sendReply("EventAck", msg.getId());
		
		var that = this;
		var evnt = lowername.split("/");
		var internalCmd = new InternalCommands();
		
		if("sendpb" == evnt[1]){
			internalCmd.sendpb(obj.data, that);
		}
		else if("sendapn" == evnt[1]){
			internalCmd.sendapn(obj.data, that);
		}
		
		return;
	}
	// COPY END
	
	if (lowername.indexOf("spark") == 0) {
	.
	.
	.
The *InternalCommands* is a utility I wrote for this and is there in the GitHub repository. The following Spark Core code snippet send internal events to send Push Notifications

    Spark.publish("cmds/sendpb", args);
    .
    .
    .
    Spark.publish("cmds/sendapn", args);

To use this, place the InternalCommands.js file in the folder `spark-server\js\node_modules\spark-protocol\clients` and insert the above code and paste it before line no. 1026 of the *SparkCore.js* file and publish above events from Spark Core.

Hope this will be useful for someone looking for the same.