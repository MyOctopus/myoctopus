// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    var MyOctopus = function () {
        var self = this;

        self.onDeviceReady = function() {
            // Handle the Cordova pause and resume events
            document.addEventListener('pause', window.myoctopus.onPause.bind(self), false);
            document.addEventListener('resume', window.myoctopus.onResume.bind(self), false);

            // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
            self.nfcChanged();
        };

        self.onPause = function() {
            // TODO: This application has been suspended. Save application state here.
        };

        self.onResume = function() {
            // TODO: This application has been reactivated. Restore application state here.
        };

        self.nfcEnabled = false;
        self.nfcChanged = function() {
            //if (nfcSwitch.isChecked() && !nfcEnabled) {
            if (!self.nfcEnabled) {
                nfc.enabled(
                    function () {                   // success, NFC is enabled on the phone
                        nfc.addNdefListener(
                            self.nfcHandler,
                            function () {           // success
                                self.nfcEnabled = true;
                                alert('nfc enabled');
                            },
                            function (error) {      /* error */
                                nfcSwitch.setChecked(false);
                                document.getElementById('settingsError').textContent = error;
                            }
                        );
                    },
                    // msg is one of NO_NFC (no hardware support) or NFC_DISABLED (supported but disabled)
                    function (msg) {
                        document.getElementById('settingsError').textContent = msg;
                        nfcSwitch.setChecked(false);
                    }
                );
            }
            else if (!nfcSwitch.isChecked() && self.nfcEnabled) {
                nfc.removeNdefListener(
                    self.nfcHandler,
                    function () {
                        self.nfcEnabled = false;
                    },
                    function (error) {
                        nfcSwitch.setChecked(true);
                        document.getElementById('settingsError').textContent = error;
                    }
                );
            }
        };

        self.nfcHandler = function (nfcEvent) {
            navigator.notification.vibrate(100);
            if (!self.nfcWriteMode)
                window.plugins.spinnerDialog.show('', 'Reading NFC data', true);
            var tag = nfcEvent.tag;
            if (!self.nfcWriteMode) {
                var nfcResult = "",
                    ndefMessage = tag.ndefMessage;
                for (var i = 0; i < ndefMessage.length; i++) {
                    if (i > 0) {
                        nfcResult += "<br/>";
                    }
                    var payload = nfc.bytesToString(ndefMessage[i].payload);
                    if (84 == ndefMessage[i].type) {
                        // for messages, strip the language prefix
                        payload = payload.substring(3);
                    }
                    nfcResult += payload;
                }
                
                document.getElementById('nfcInput').textContent = nfcResult;
            }
            else {
                if (!tag.isWritable) { alert('tag not writable!'); }
                else {
                    var nfcRecords = [
                        ndef.textRecord(new Date()),
                        ndef.textRecord(document.getElementById('nfcInput').value),
                        ndef.uriRecord("http://myoctopus.com")
                    ]
                    nfc.write(
                        nfcRecords,
                        function () { self.nfcWriteMode = false; alert('successfully written'); },
                        function (e) { self.nfcWriteMode = false; alert(e); }
                    );
                }
            }

            window.plugins.spinnerDialog.hide();
        }

        self.nfcWriteMode = false;
        self.writeNfc = function () {
            self.nfcWriteMode = true;

            // spinner with message, and a log message when it's dismissed
            window.plugins.spinnerDialog.show(
                null, // title
                "Touch the NFC tag to write...", // message
                function () {
                    // dismissed
                    self.nfcWriteMode = false;
                }
           );
        }
    };

    window.myoctopus = new MyOctopus();
    document.addEventListener('deviceready', window.myoctopus.onDeviceReady.bind(self), false);
})();