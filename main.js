const Influx = require('influxdb-nodejs');
const Collector = require('./collector.js');

var influxUsername = process.env.INFLUX_USERNAME || "admin";
var influxPassword = process.env.INFLUX_PASSWORD || "password";
var influxHostname = process.env.INFLUX_HOSTNAME || "bf-influxdb";
var influxPort = process.env.INFLUX_PORT || "8086";

var mapsToMonitor = [
	["HTZ", "caucasus", "80s", getInfluxClient("blueflag_c80s")],
	["HTZ2", "persian gulf", "modern", getInfluxClient("blueflag_pgm")],
	["HTZ", "syria", "80s", getInfluxClient("blueflag_s80s")],
	["HTZ2", "syria", "modern", getInfluxClient("blueflag_sm")]
];

function getInfluxClient(db) {
	return new Influx(`http://${influxUsername}:${influxPassword}@${influxHostname}:${influxPort}/${db}`);	
}

mapsToMonitor.forEach(function(mapItem) {
	var type = mapItem[0];
	var map = mapItem[1];
	var timeframe = mapItem[2];
	var influxClient = mapItem[3];

	var collector = new Collector(type, map, timeframe, function(blue, red) {
		influxClient.write('playercount').field({
                	red: red,
                	blue: blue
        	}).then(() => null)
		.catch(err => console.error(`sync write queue fail, ${err.message}`));
	});

	collector.collect();
});
