const https = require('https');

function kraken() {
	this.name = "Kraken";
	this.updated = new Date();
	this.timeout = 2000;
	try {
		this.update();
	} catch (e) {
		console.log(e);
		this.timeout = 20000;
		setTimeout(this.update.bind(this), this.timeout);
	}
}

kraken.prototype.update = function() {
	var self = this;
	var options = {
		host: 'data.alkemi.ai',
		path: '/Simulations/kraken.json',
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

module.exports = kraken;
