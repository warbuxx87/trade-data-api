//const https = require('https');
var fs = require('fs');


function binance() {
	this.name = "Binance";
	this.updated = new Date();
	this.timeout = 5000;
	try {
		this.update();
	} catch (e) {
		console.log(e);
		setTimeout(this.update.bind(this), this.timeout);
	}
}

binance.prototype.update = function() {
var self = this;
var options = {
	host: 'data.alkemi.ai',
	path: '/Simulations/binance.json',
	port: 443,
	method: 'GET'
};

callback = function(err, data) {
	var str = '';
	if (err) {
		throw err;
	}
	data.on('data', function(chunk) {
		str += chunk;
	});

	data.on('end', function() {
		var data = JSON.parse(str);
		self.SpotOrders = data.SpotOrders;
	});
}

//https.request(options, callback).end();
fs.readFile('/root/HTS/Simulations/binance.json', callback(data.toString)).end();
});

setTimeout(function() {
	self.update();
}, self.timeout);
};

module.exports = binance;
