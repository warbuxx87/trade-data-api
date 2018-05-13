const https = require('https');
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
	var data = '';
	var readStream = fs.createReadStream('/root/HTS/Simulations/binance.json', 'utf8');

	readStream.on('data', function(chunk) {
		data += chunk;
	}).on('end', function() {
		console.log(data);
		var data = JSON.parse(str);
		self.SpotOrders = data.SpotOrders;
	});

	setTimeout(function() {
		self.update();
	}, self.timeout);
};

module.exports = binance;
