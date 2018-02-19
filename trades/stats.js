const https = require('https');

function stats() {
  this.name = "Stats";
  this.total = 0;
  this.buy_orders = 0;
  this.sell_orders = 0;
  this.failed = 0;
  this.success = 0;
  this.buy_total = 0;
  this.sell_total = 0;
  this.fail_total = 0;
  this.usd = 0;
  this.btc = 0;
  this.avg_buy = 0;
  this.avg_sell = 0;
  this.updated = new Date(2000, 1, 1);
  this.timeout = 5000;
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

        response.on('end', function() {
            var data = JSON.parse(str);
            var exchanges = data.exchanges.length;
            console.log('exchanges: ' exchanges)
            var i = 0;
            var exchange = "";
            var total;
            var buy_total;
            var sell_total;
            var buy_orders;
            var sell_orders;
            var usd;
            var btc;
            var success;
            var failed;
            var fail_total;
            var avg_buy;
            var avg_sell;

            while (exchanges > i) {
              exchange = data.exchanges[i];
              total = total+exchange.total;
              buy_total = buy_total+exchange.buy_total;
              buy_orders = buy_orders+exchange.buy_orders;
              sell_total = sell_total+exchange.sell_total;
              sell_orders = sell_total+exchange.sell_total;
              usd = usd+exchange.usd;
              btc = btc+exchange.btc;
              success = success+exchange.success;
              failed = failed+exchange.failed;
              fail_total = fail_total+exchange.fail_total;
              avg_buy = avg_buy+exchange.avg_buy;
              avg_sell = avg_sell+exchange.avg_sell;
              i++
            }


            self.total = total;
            self.buy_orders = buy_orders;
            self.sell_orders = sell_orders;
            self.failed = failed;
            self.success = success;
            self.buy_total = buy_total;
            self.sell_total = sell_total;
            self.fail_total = fail_total;
            self.usd = usd;
            self.btc = btc;
            self.avg_buy = avg_buy;
            self.avg_sell = avg_sell;
        });
    }

    https.request(options, callback).end();

    setTimeout(function() {
        self.update();
    }, self.timeout);
};

module.exports = stats;
