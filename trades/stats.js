const https = require('https');

function stats() {
	this.name = "Stats";
	this.updated = new Date(2000, 1, 1);
	this.timeout = 30000;
	try {
		this.update();
	} catch (e) {
		console.log(e);
		setTimeout(this.update.bind(this), this.timeout);
	}
}

stats.prototype.update = function() {
	var self = this;
	var options = {
		host: 'api.alkemi.ai',
		path: '/',
		port: 443,
		method: 'GET'
	};

	callback = function(response) {
		var str = '';
		response.on('data', function(chunk) {
			str += chunk;
		});

		var i = 0;
		var exchange = "";
		var total = 0;
		var buy_total = 0;
		var sell_total = 0;
		var buy_orders = 0;
		var sell_orders = 0;
		var usd = 0;
		var btc = 0;
		var success = 0;
		var failed = 0;
		var fail_total = 0;
		var avg_buy = 0;
		var avg_sell = 0;
		var name = name;

		response.on('end', function() {
			var data = JSON.parse(str);
			var exchanges = data.exchanges.length;
			console.log('exchanges: ', exchanges)


			while (exchanges > i) {
				exchange = data.exchanges[i];
				name = exchange.name;
				console.log('\n ##### exchange: ', name);
				total = total + exchange.total;
				console.log('total: ', total);
				buy_total = buy_total + exchange.buy_total;
				console.log('buy_total: ', buy_total);
				buy_orders = buy_orders + exchange.buy_orders;
				console.log('buy_orders: ', buy_orders);
				sell_total = sell_total + exchange.sell_total;
				console.log('sell_total: ', sell_total);
				sell_orders = sell_orders + exchange.sell_orders;
				console.log('sell_orders: ', sell_orders);
				usd = usd + exchange.usd;
				console.log('usd: ', usd);
				btc = btc + exchange.btc;
				console.log('btc: ', btc);
				success = success + exchange.success;
				console.log('success: ', success);
				failed = failed + exchange.failed;
				console.log('failed: ', failed);
				fail_total = fail_total + exchange.fail_total;
				console.log('fail_total: ', fail_total);
				//avg_buy = avg_buy+exchange.avg_buy;
				//console.log('avg_buy: ', avg_buy);
				//avg_sell = avg_sell+exchange.avg_sell;
				//console.log('avg_sell: ', avg_sell);
				i++
			}
			self.total = total;
			self.buy_orders = buy_orders;
			self.sell_orders = sell_orders;
			self.failed = failed;
			self.success = success / exchanges;
			self.buy_total = buy_total;
			self.sell_total = sell_total;
			self.fail_total = fail_total;
			self.usd = usd;
			self.btc = btc;
			self.avg_buy = buy_total / buy_orders;
			self.avg_sell = sell_total / sell_orders;
			self.updated = new Date();
		});
	}

	https.request(options, callback).end();

	setTimeout(function() {
		self.update();
	}, self.timeout);
};

module.exports = stats;
