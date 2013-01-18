   //
   // Ring on the third call from a given number when my phone is silent
   //

	// Initializing variables 

	var callAttempt = "3" /* third */;
   var numberAttempt = "8885551212" /* a given number */;

	// End of variables initializing 

	console.log("Starting script: Ring on third call from the same person when my phone is silent");
  var periodInHours = 24;
  callAttempt = parseInt(callAttempt, 10);


  device.audio.on("ringerModeChanged", function(signal) {
    device.db.delete("ringOnManyAttempts.missedCall",{});
  });


  device.telephony.on('outgoingCall', function(call){
    device.db.delete("ringOnManyAttempts.missedCall",{});
  });

  device.telephony.on('incomingCall', function(call){

    if (device.audio.ringerMode == 'normal'){
      return;
    }

    // called if the phone call was answered
    var offHookListener = function(signal) {
      device.telephony.off("idle",idleListener);
      device.db.delete("ringOnManyAttempts.missedCall",{});
    };

    // called if the phone call was missed
    var idleListener = function(signal)	{
      device.telephony.off("offHook",offHookListener);
      // we missed the call
      var missedCallSignal = {tag : call.phoneNumber,utcTimestamp: new Date() };
      device.db.insert("ringOnManyAttempts.missedCall", missedCallSignal);

      var now = new Date();
      var startTime = new Date();
      startTime.setHours(now.getHours() - periodInHours);
      var query = { utcTimestamp: { start: startTime, end: now }, tag: call.phoneNumber };
      device.db.query("ringOnManyAttempts.missedCall", query).toArray(function(err, results){
        if (!err && results.length >= callAttempt - 1 && call.phoneNumber == numberAttempt){
          console.log("setting ringer to normal: ");
          device.audio.ringerMode = 'normal';
          device.audio.ringerVolume = 100;
        }
      });
    };

    device.telephony.once("offHook", offHookListener);
    device.telephony.once("idle", idleListener);

  });
