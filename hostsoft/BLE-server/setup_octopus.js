var util = require('util'),
	bleno = require('bleno'),
	os = require('os'),
	shell = require('python-shell'),
	path = require('path');

var BlenoPrimaryService = bleno.PrimaryService;
var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

var ipAddress = '';
var setupInitiated = false;
var setupJson = '';
var setupSecretKey = 'octopus';
var onSetupCompleted = null;
console.log('Starting Octopus Setup Listener...');

var IpRequest = function() {
  IpRequest.super_.call(this, {
    uuid: '073c0ba0fe0c458d879c43ec3029a534',
    properties: ['read'],
    value: new Buffer(ipAddress),
    descriptors: [
      new BlenoDescriptor({
        uuid: '2901',
        value: 'Octopus IP Address'
      })
    ]
  });
};
util.inherits(IpRequest, BlenoCharacteristic);

var SetupOctopusInit = function() {
  SetupOctopusInit.super_.call(this, {
    uuid: 'aa59ad9e250b11e5b4eb080027f13330',
    properties: ['write']
  });
};

util.inherits(SetupOctopusInit, BlenoCharacteristic);

SetupOctopusInit.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
    if (data.toString() == setupSecretKey) {
        setupInitiated = true;
		setupJson = '';
        console.log('Octopus::Setup::setupInitiated');
    }
    
    callback(this.RESULT_SUCCESS);
};

var SetupOctopusData = function() {
  SetupOctopusData.super_.call(this, {
    uuid: 'e4d81ca090be45f6b6a8a1335c6ffe9d',
    properties: ['write']
  });
};

util.inherits(SetupOctopusData, BlenoCharacteristic);

SetupOctopusData.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
    if (setupInitiated) {
        setupJson += data.toString();
        console.log('Octopus::Setup::setupDataReceived: ' + data.toString());
        //console.log('Octopus::Setup::setupDataSoFar: ' + setupJson);
    }
    
    callback(this.RESULT_SUCCESS);
};

var SetupOctopusDone = function() {
  SetupOctopusDone.super_.call(this, {
    uuid: 'bbde8a9e250b11e58c29080027f13330',
    properties: ['write']
  });
};

util.inherits(SetupOctopusDone, BlenoCharacteristic);

SetupOctopusDone.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
    if (data.toString() == setupSecretKey) {
        console.log('Octopus::Setup::setupDataFinalized: ' + setupJson);
        console.log('Octopus::Setup::setupDataReceived: ' + JSON.parse(setupJson));
		setupInitiated = false;
		
		var setupData = JSON.parse(setupJson);
		callback(this.RESULT_SUCCESS);

		var options = {
			mode: 'text',
			pythonPath: '/usr/bin/python',
			pythonOptions: [],
			scriptPath: path.resolve(),
			//
			// Data format:
			//
			// [ 'new edison name' (or '' if the name is not to be changed),
			//   'root password'  (or '' if the password is not to be changed),
			//   'SSID',
			//   'WiFi password']
			//
			args: [setupData.devicename, setupData.rootpwd, setupData.ssid, setupData.wifipwd]
		};
		
		console.log('Done.');
		if (null != onSetupCompleted) {
			var data = { result: 0 };
			if (!os.networkInterfaces()['wlan0']) data.result = 4; // network init error
			data = new Buffer(JSON.stringify(data));
			onSetupCompleted(data);
			if (os.networkInterfaces()['wlan0']) {
				data = { ip: os.networkInterfaces()['wlan0'][0]['address'] };
				data = new Buffer(JSON.stringify(data));
				onSetupCompleted(data);
			}
		}
		
		/*

		var shell = shell.run('setup_octopus.py', options, function (err, results) {
			console.log('Return code: ' + shell.exitCode);
			// exitCode = 0 -> OK
			//            1 -> wrong SSID (not found during scan)
			//            2 -> wifi password is too long or too short
			//            4 -> network initialization failed
			console.log('Output:      ' + results);

			var success = true, error = '', ipAddress = '';
			switch (shell.exitCode) {
				case 0:
					// All OK, return new IP address
					ipAddress = os.networkInterfaces()['wlan0'][0]['address'];
					console.log('Octopus::Setup::SetupComplete return value: ' + ipAddress);
					break;
				case 1:
					// 
				break;
			}

			var data = { key: configData.key, success: success, error: error; data: ipAddress }
			var data = new Buffer(JSON.stringify(data));
			if (null != onSetupCompleted) onSetupCompleted(data);
		});
		*/
	}
};


var SetupComplete = function() {
  SetupComplete.super_.call(this, {
    uuid: '5793bd4264044c79b299122bbf7d0df1',
    properties: ['notify']
  });
};

util.inherits(SetupComplete, BlenoCharacteristic);

SetupComplete.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('Octopus::Setup::SetupComplete subscribe');
  onSetupCompleted = updateValueCallback;
};

function OctopusSetupService() {
  OctopusSetupService.super_.call(this, {
    uuid: '336c7591087942baaf69b13e491e0b3a',
    characteristics: [
      new IpRequest(),
      new SetupOctopusInit(),
	  new SetupOctopusData(),
	  new SetupOctopusDone(),
      new SetupComplete()
    ]
  });
}

util.inherits(OctopusSetupService, BlenoPrimaryService);

bleno.on('stateChange', function(state) {
  console.log('Octopus::Setup::stateChange: ' + state + ', address = ' + bleno.address);

  if (state === 'poweredOn') {
    bleno.startAdvertising('Octopus_123', ['336c7591087942baaf69b13e491e0b3a']);
  } else {
    bleno.stopAdvertising();
  }
});

// Linux only events /////////////////
bleno.on('accept', function(clientAddress) {
  console.log('Octopus::Setup::accept, client: ' + clientAddress);

  bleno.updateRssi();
});

bleno.on('disconnect', function(clientAddress) {
  console.log('Octopus::Setup::disconnect, client: ' + clientAddress);
});

bleno.on('rssiUpdate', function(rssi) {
  console.log('Octopus::Setup::rssiUpdate: ' + rssi);
});
//////////////////////////////////////

bleno.on('mtuChange', function(mtu) {
  console.log('Octopus::Setup::mtuChange: ' + mtu);
});

bleno.on('advertisingStart', function(error) {
  console.log('Octopus::Setup::advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([
      new OctopusSetupService()
    ]);
  }
});

bleno.on('advertisingStop', function() {
  console.log('Octopus::Setup::advertisingStop');
});

bleno.on('servicesSet', function(error) {
  console.log('Octopus::Setup::servicesSet: ' + (error ? 'error ' + error : 'success'));
});
