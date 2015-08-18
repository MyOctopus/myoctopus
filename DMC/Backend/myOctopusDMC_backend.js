var express = require('express');
var app = express();
var router = express.Router();
var port = process.env.PORT || 3500;
var pythonShell = require('python-shell');

router.get('/', function(req, res) {
    res.json({ message: 'Welcome to MyOctopus DMC api!' });
});
router.get('/getCpuStats', function(req, res) {
    res.json({ cpuUsagePercent: '75' });
});
router.get('/getMemoryStats', function(req, res) {
    res.json({
        totalMemory: '4000',
        freeMemoryPercentage: '45'
    });
});
router.get('/getStorageStats', function(req, res) {
    res.json({
        totalStorageSizeInMB: '75',
        freeStorageSizeInMB: '34',
        freeStorageSizeInPercentage: '2323'
    });
});
router.get('/getWifiStats', function(req, res) {
    res.json({
        isEnabled: 'true',
        isConnected: 'true',
        networkSSID: 'home network'
    });
});
router.get('/getBluetoothStats', function(req, res) {
    res.json({ isEnabled: 'true' });
});
router.get('/getSensorsStats', function(req, res) {
    var currentDate =  new Date();
    var stats = {};
    stats.sensors = [];
    stats.sensors.push( { sensor: Octopus.sensors.temperature, lastReadingDate: currentDate, lastReadingValue: Math.floor((Math.random() * 1000) + 1) });
    stats.sensors.push( { sensor: Octopus.sensors.humidity, lastReadingDate: currentDate, lastReadingValue: Math.floor((Math.random() * 1000) + 1) });
    stats.sensors.push( { sensor: Octopus.sensors.light, lastReadingDate: currentDate, lastReadingValue: Math.floor((Math.random() * 1000) + 1) });
    stats.sensors.push( { sensor: Octopus.sensors.pressure, lastReadingDate: currentDate, lastReadingValue: Math.floor((Math.random() * 1000) + 1) });
    res.json(stats);
});
router.get('/getSensorsHistoricValues', function(req, res) {
    res.json({ percentageUsage: '75' });
});
app.use('/api', router);
app.listen(port);
console.log('MyOctopus DMC backend on port ' + port);