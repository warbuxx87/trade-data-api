const https = require('https');

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
		path: '/Simulations/poloniex.json',
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
			self.Orders - data.Orders
		});
	}

	https.request(options, callback).end();

	setTimeout(function() {
		self.update();
	}, self.timeout);
};

module.exports = poloniex;