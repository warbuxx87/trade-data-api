const https = require('https');

function bots() {
	this.updated = new Date(2000, 1, 1);
	this.timeout = 5000;
	try {
		this.update();
	} catch (e) {
		console.log(e);
		setTimeout(this.update.bind(this), this.timeout);
	}
}

bots.prototype.update = function() {
	var self = this;
	var options = {
		host: 'data.alkemi.ai',
		path: '/CustomBots/bot1.json',
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
			var trades = data.InterExchangeArbitrageBot.CompletedOrders.BaseOrder;
			self.updated = new Date(); // grab all completed orders
			self.trades = trades;

		});
	}

	https.request(options, callback).end();

	setTimeout(function() {
		self.update();
	}, self.timeout);
};

module.exports = bots;
