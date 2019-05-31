const https = require('https');
const fs = require('fs');
var iconv = require('iconv-lite');
var xgemini = "6af0fee7-3ec5-4272-83c9-b56ffc6b2b73";


// Convert encoding streaming for gdax
//fs.createReadStream('/root/HTS/Simulations/' + xgemini + '_history.json')
//	.pipe(iconv.decodeStream('utf-16'))
//	.pipe(iconv.encodeStream('utf-8'))
//	.pipe(fs.createWriteStream('/root/HTS/Simulations/gemini.json'));


// Sugar: all encode/decode streams have .collect(cb) method to accumulate data.
https.createServer(function(req, res) {
	req.pipe(iconv.decodeStream('utf-16')).collect(function(err, body) {
		assert(typeof body == 'string');
		console.log(body); // full request body string
	});
});

function sim1() {
	this.name = "Gemini";
	this.updated = new Date(2000, 1, 1);
	this.timeout = 20000;
	try {
		this.update();
	} catch (e) {
		console.log(e);
		setTimeout(this.update.bind(this), this.timeout);
	}
}

sim1.prototype.update = function() {
	var self = this;
	var options = {
		host: 'data.alkemi.ai',
		path: '/Simulations/' + xgemini + '_history.json',
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

			var SpotOrders = data.SpotOrders;

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
			self.last_arbitrage = self.last_arbitrage.replace('Gemini', '');
			self.updated = last.UnixLastUpdate;
		});
	}

	https.request(options, callback).end();

	setTimeout(function() {
		self.update();
	}, self.timeout);
};

module.exports = sim1;