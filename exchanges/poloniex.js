const https = require('https');
var xpoloniex = "ea529fcb-ad7a-4ede-b808-62aa2de0a268";

function poloniex() {
	this.name = "poloniex";
	this.updated = new Date();
	this.timeout = 5000;
	try {
		this.update();
	} catch (e) {
		console.log(e);
		setTimeout(this.update.bind(this), this.timeout);
	}
}

poloniex.prototype.update = function() {
	var self = this;
	var options = {
		host: 'data.alkemi.ai',
		path: '/Simulations/' + xpoloniex + '_history.json',
		port: 443,
		method: 'GET'
	};

	callback = function(response) {
		var chunks = []
		response.on('data', function(chunk) {
			chunks.push(chunk);
		});

		response.on('end', function() {
			var decodedBody = iconv.decode(Buffer.concat(chunks), 'utf16');
			var str = '';
			var data = JSON.parse(decodedBody);
			self.SpotOrders = data.SpotOrders;
			self.Orders - data.Orders
		});
	}

	https.request(options, callback).end();

	setTimeout(function() {
		self.update();
	}, self.timeout);
};

module.exports = poloniex;