const https = require('https');
const fs = require('fs');
const iconv = require('iconv-lite');
var xpoloniex = "ea529fcb-ad7a-4ede-b808-62aa2de0a268";

// // Convert encoding streaming for poloniex
// fs.createReadStream('/root/HTS/Simulations/' + xpoloniex + '_history.json')
// 	.pipe(iconv.decodeStream('utf-16'))
// 	.pipe(iconv.encodeStream('utf-8'))
// 	.pipe(fs.createWriteStream('/root/HTS/Simulations/poloniex.json'));

function sim8() {
	this.name = "Poloniex";
	this.updated = new Date(2000, 1, 1);
	this.timeout = 20000;
	try {
		this.update();
	} catch (e) {
		console.log(e);
		setTimeout(this.update.bind(this), this.timeout);
	}
}

sim8.prototype.update = function() {
	var self = this;
	var options = {
		host: 'data.alkemi.ai',
		path: '/Simulations/' + xpoloniex + '_history.json',
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

			// lets grab info about the last order
			var last = data.SpotOrders.pop();

			// how many orders in total?
			var total = self.total = data.SpotOrders.length;

			// amount of successful buy_orders?
			var buy_orders = 0;

			// amount of successful sell_orders?
			var sell_orders = 0;

			// counter variable
			var i = 0;

			var check = "";
			var failed = 0;
			var orderStatus = "";
			var bought = 0;
			var sold = 0;
			var fail_total = 0;
			var origin;
			while (total > i) {
				check = data.SpotOrders[i].OrderType;
				if (check != 1) {
					check = "Sell";
				}
				if (check != "Sell") {
					check = "Buy";
				}
				orderStatus = data.SpotOrders[i].OrderStatus;
				origin = data.SpotOrders[i].Origin;
				price = data.SpotOrders[i].Price;
				//console.log(check);
				if (orderStatus != 5) {
					//check = "No";
					failed = failed + 1;
					fail_total = fail_total + price;
				}
				//origin checks if corresponding trade completed
				if (origin != "") {
					if (check == "Sell") {
						sell_orders = sell_orders + 1;
						sold = sold + price;
					}
					if (check == "Buy") {
						buy_orders = buy_orders + 1;
						bought = bought + price;
					}
				}
				i++
			}
			//how many of our orders complete?
			var success = parseFloat(1 - (failed / total));

			//how much more USD have we sold than bought?
			var usd = parseFloat(sold - bought);

			//how much more BTC have we bought than sold?
			var btc = parseFloat(buy_orders - sell_orders);

			// what's our average buy price per BTC?
			var avg_buy = bought / buy_orders;

			//what's our average sell price per BTC?
			var avg_sell = sold / sell_orders;

			self.order = check;
			self.price = parseFloat(last.Price);
			self.amount = last.Amount;
			self.total = data.SpotOrders.length;
			self.buy_orders = buy_orders;
			self.sell_orders = sell_orders;
			self.failed = failed;
			self.success = success;
			self.buy_total = bought;
			self.sell_total = sold;
			self.fail_total = fail_total;
			self.usd = usd;
			self.btc = btc;
			self.avg_buy = avg_buy;
			self.avg_sell = avg_sell;
			self.last_arbitrage = last.Origin.toString().substr(25)
			self.last_arbitrage = self.last_arbitrage.replace('Poloniex', '');
			self.updated = last.UnixLastUpdate;
		});
	}

	https.request(options, callback).end();

	setTimeout(function() {
		self.update();
	}, self.timeout);
};

module.exports = sim8;