const https = require('https');

function sim1() {
  this.name = "Gemini";
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

sim1.prototype.update = function() {
    var self = this;
    var options = {
        host: 'data.alkemi.ai',
        path: '/Simulations/gemini.json',
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
            //console.log(last);
            self.order = last.OrderTypeAsString;
            self.price = parseFloat(last.Price);
            self.amount = last.Amount;
            self.total = data.SpotOrders.length;
            self.arbitrage = last.Origin.toString().substr(25);
            self.updated = last.LastUpdate;
        });
    }

    https.request(options, callback).end();

    setTimeout(function() {
        self.update();
    }, self.timeout);
};

module.exports = sim1;
