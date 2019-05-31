const https = require('https');
const fs = require('fs');
var iconv = require('iconv-lite');

// Convert encoding streaming example
fs.createReadStream('/root/HTS/Simulations/b29d0acb-9a6e-49f2-8fd8-a137559f834c_history.json')
	.pipe(iconv.decodeStream('utf-16'))
	.pipe(iconv.encodeStream('utf-8'))
	.pipe(fs.createWriteStream('/root/HTS/Simulations/binance2.json'));

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
		path: '/Simulations/binance2.json',
		port: 443,
		method: 'GET'
	};

	callback = function(response) {
		var str = '';
		response.on('data', function(chunk) {
			str += chunk;
		});

		response.on('end', function() {
			var data = JSON.parse(str);
			self.SpotOrders = data.SpotOrders;
		});
	}

	https.request(options, callback).end();

	setTimeout(function() {
		self.update();
	}, self.timeout);
};

module.exports = binance;