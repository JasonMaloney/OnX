/*
 * Use this recipe to turn your smartphone into a silent "desk clock"
 * while at home/work/anywhere. The intention is that the phone will
 * still be in your peripheral vision, thus you will see incoming calls
 * even while silent. On Android 4.1.1 and lower, the stock DeskClock
 * becomes a dim screensaver after a brief period of time. I use this
 * rule in combination with an app that automatically dims my capacitive
 * buttons after a few seconds.
 */

var network = 'myWiFiNetwork';

console.log('Started Script:' + device.currentSource);

var originalMode = null;

function setSilent()
{
    if (originalMode === null) originalMode = device.audio.ringerMode;
    device.audio.ringerMode = 'silent';
}

function setOriginal()
{
    if (originalMode !== null)
    {
        device.audio.ringerMode = originalMode;
        originalMode = null;
    }
}

function sleep(ms) {
    ms += new Date().getTime();
    while (new Date() < ms){}
}

device.battery.on('startedCharging', function(signal)
{
    console.log('Device started charging');
    if (signal.isUSBConnected || signal.isACConnected)
    {
        console.log('Detected USB/AC charging');
        if (device.network.wifiEnabled)
        {
            console.log('Detected WiFi enabled');
            if (device.network.status.ssid == network)
            {
                console.log('Detected network ' + network + ', launching DeskClock');
                // Handle race condition -- wait for USB storage dialog to appear first
                sleep(1000);
                device.applications.launchPackage('com.google.android.deskclock');
                setSilent();
                
                device.battery.once('updated', function(signal)
                {
                    if (!signal.isUSBConnected && !signal.isACConnected)
                    {
                        setOriginal();
                    }
                });
            }
        }
    }
});

console.log('Completed Script:' + device.currentSource);
