const https = require('https');

function sim2() {
  this.name = "GDAX";
  this.order = 0;
  this.price = 0;
  this.amount = 0;
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
  this.last_arbitrage = 0;
  this.updated = new Date(2000, 1, 1);
  this.timeout = 5000;
  try {
      this.update();
  } catch (e) {
      console.log(e);
      setTimeout(this.update.bind(this), this.timeout);
  }
}

sim2.prototype.update = function() {
    var self = this;
    var options = {
        host: 'data.alkemi.ai',
        path: '/Simulations/gdax.json',
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
            var last = data.SpotOrders.pop();
            var total = self.total = data.SpotOrders.length;
            var buy_orders = 0;
            var sell_orders = 0;
            var i = 0;
            var check = "";
            var failed = 0;
            var OrderStatus = "";
            var bought = 0;
            var sold = 0;
            var fail_total = 0;
            while (total > i) {
              check = data.SpotOrders[i].OrderTypeAsString;
              orderStatus = data.SpotOrders[i].OrderStatusAsString;
              price = data.SpotOrders[i].Price;
              //console.log(check);
              if (orderStatus != "Completed" ){
                check = "No";
                failed = failed+1;
                fail_total = fail_total+price;
              }
              if (check == "Sell") {
                sell_orders = sell_orders+1;
                sold = sold+price;
              }
              if (check == "Buy") {
                buy_orders = buy_orders+1;
                bought = bought+price;
              }
              i++
            }
            var success = parseFloat(1-(failed/total));
            //how much more USD have we sold than bought?
            var usd = parseFloat(sold-bought);
            //how much more BTC have we bought than sold?
            var btc = parseFloat(buy_orders-sell_orders);
            //console.log(last);
            self.order = last.OrderTypeAsString;
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
            self.last_arbitrage = last.Origin.toString().substr(25);
            self.updated = last.LastUpdate;
        });
    }

    https.request(options, callback).end();

    setTimeout(function() {
        self.update();
    }, self.timeout);
};

module.exports = sim2;
