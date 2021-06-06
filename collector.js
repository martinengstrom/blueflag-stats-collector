var ioc = require('socket.io-client');
module.exports = class Collector {
	constructor(type, map, timeframe, callback) {
		this.type = type;
		this.map = map;
		this.timeframe = timeframe;
		this.callback = callback;
	}

	collect() {
		this.client = ioc.connect("http://gadget.buddyspike.net");
		var clazz = this;

		this.client.on('jsonpilots emited', function(msg) {
			clazz.parseJSONPilotsData(msg);
		});

		this.client.on('reconnect', (attemptNumber) => {
			clazz.log("Reconnected, attempt #" + attemptNumber);
			clazz.startReceiveBFData();
		});

		this.client.once("connect", function() {
			clazz.log("Connected");
			clazz.startReceiveBFData();
		});
	}

	log(str) {
		console.log(`[${this.map} ${this.timeframe}] ${str}`);
	}

	startReceiveBFData() {
		this.client.emit("map_start", this.type, this.map, this.timeframe, function(message) {
		});
	}

	parseJSONPilotsData(data) {
		var blueCount = 0;
		var redCount = 0;

		JSON.parse(data).forEach(function(player) {
			if (player.side == 1)
				redCount++;
			else if (player.side == 2)
				blueCount++;
		});

		this.callback(blueCount, redCount);
	}
}
