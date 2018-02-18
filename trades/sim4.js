const https = require('https');

function sim4() {
  this.name = "Kraken";
  this.order = 0;
  this.price = 0;
  this.amount = 0;
  this.total = 0;
  this.arbitrage = 0;
  this.updated = new Date(2000, 1, 1);
  this.timeout = 5000;
  try {
      this.update();
  } catch (e) {
      console.log(e);
      setTimeout(this.update.bind(this), this.timeout);
  }
}

sim4.prototype.update = function() {
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
            var last = data.SpotOrders.pop();
            var total = self.total = data.SpotOrders.length;
            var buy_orders = 0;
            var sell_orders = 0;
            var i = 0;
            var check = 2;
            while (total > i) {
              check = data.SpotOrders[i].OrderTypeAsString;
              //console.log(check);
              if (check == "Sell") {
                sell_orders = sell_orders+1;
              }
              if (check == "Buy") {
                buy_orders = buy_orders+1;
              }
              i++
            }
            //console.log(last);
            self.order = last.OrderTypeAsString;
            self.price = parseFloat(last.Price);
            self.amount = last.Amount;
            self.total = data.SpotOrders.length;
            self.buy_orders = buy_orders;
            self.sell_orders = sell_orders;
            self.arbitrage = last.Origin.toString().substr(25);
            self.updated = last.LastUpdate;
        });
    }

    https.request(options, callback).end();

    setTimeout(function() {
        self.update();
    }, self.timeout);
};

module.exports = sim4;
