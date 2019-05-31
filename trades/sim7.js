const https = require('https');
const fs = require('fs');
const iconv = require('iconv-lite');
var xbinance = "b29d0acb-9a6e-49f2-8fd8-a137559f834c";

// Convert encoding streaming for binance
// fs.createReadStream('/root/HTS/Simulations/' + xbinance + '_history.json')
// 	.pipe(iconv.decodeStream('utf-16'))
// 	.pipe(iconv.encodeStream('utf-8'))
// 	.pipe(fs.createWriteStream('/root/HTS/Simulations/binance.json'));

function sim7() {
	this.name = "Binance";
	this.updated = new Date(2000, 1, 1);
	this.timeout = 20000;
	try {
		this.update();
	} catch (e) {
		console.log(e);
		setTimeout(this.update.bind(this), this.timeout);
	}
}

sim7.prototype.update = function() {

	var self = this;
	var options = {
		host: 'data.alkemi.ai',
		path: '/Simulations/' + xbinance + '_history.json',
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

			// lets grab info about the last order
			var last = data.SpotOrders.pop();
			var last2 = data.Orders.pop();

			// how many orders in total?
			var total1 = data.SpotOrders.length;
			var total2 = data.Orders.length;
			var total = total1 + total2;


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
			orderStatus = data.SpotOrders[i].OrderStatus;
			origin = data.SpotOrders[i].Origin;
			price = data.SpotOrders[i].Price;
			while (total1 > i) {
				check = data.SpotOrders[i].OrderType;
				if (check != 1) {
					check = "Sell";
					sell_orders = sell_orders + 1;
					sold = sold + price;
				}
				if (check != "Sell") {
					check = "Buy";
					buy_orders = buy_orders + 1;
					bought = bought + price;
				}
				//console.log(check);
				if (orderStatus != 5) {
					//check = "No";
					failed = failed + 1;
					fail_total = fail_total + price;
				}
				i++
			}

			i = 0;
			// check loops for ORder totals
			price = data.Orders[i].Price;
			while (total2 > i) {
				check = data.Orders[i].IsBuyOrder;
				if (check = false) {
					check = "Sell";
					sell_orders = sell_orders + 1;
					sold = sold + price;
				}
				if (check = true) {
					check = "Buy";
					buy_orders = buy_orders + 1;
					bought = bought + price;
				}
				orderStatus = data.Orders[i].Status;

				//console.log(check);
				if (orderStatus != 5) {
					//check = "No";
					failed = failed + 1;
					fail_total = fail_total + price;
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

			check = data.SpotOrders[i].OrderType;

			self.order = check;
			self.price = parseFloat(last.Price);
			self.amount = last.Amount;
			self.total = total;
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
			self.updated = last.UnixLastUpdate;
		});
	}

	https.request(options, callback).end();

	setTimeout(function() {
		self.update();
	}, self.timeout);
};

module.exports = sim7;