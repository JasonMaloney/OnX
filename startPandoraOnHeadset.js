
console.log('Started Script:' + device.currentSource);

    if (!(device.version && device.version.isSupported(0, 54))) {

        var notification = device.notifications.createNotification('on{X} is out of date');
        notification.content = "the recipe '" + device.currentSource + "' requires an up to date on{X} application.";
        notification.show();
    }
    else {

        device.audio.on('headsetConnected', function (signal) {

            if (signal.isConnected) {

                // adjust media volume if needed using:
                device.media.volume = 50;

                //device.media.play();
                device.applications.launchPackage('com.pandora.android');
            }
        });
    }

    console.log('Completed Script:' + device.currentSource);
