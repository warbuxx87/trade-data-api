const https = require('https');

function bot17() {
  this.name = "";
  this.profits = 0;
  this.trades = 0;
  this.avg_earn = 0;
  this.roi = 0;
  this.fees = 0;
  this.updated = new Date(2000, 1, 1);
  this.timeout = 5000;
  try {
      this.update();
  } catch (e) {
      console.log(e);
      setTimeout(this.update.bind(this), this.timeout);
  }
}

bot17.prototype.update = function() {
    var self = this;
    var options = {
        host: 'data.alkemi.ai',
        path: '/CustomBots/bot17.json',
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
            var profits = data.InterExchangeArbitrageBot.TotalProfits;
            try {
              var trades = data.InterExchangeArbitrageBot.CompletedOrders.BaseOrder.length;
              var avg_earn = profits / trades;
            } catch (e) {
                var trades = 0;
                var avg_earn = 0;
            }
            self.profits = parseFloat(profits);
            self.trades = parseFloat(trades);
            self.avg_earn = parseFloat(avg_earn);
            self.roi = parseFloat(data.InterExchangeArbitrageBot.ROI);
            self.fees = parseFloat(data.InterExchangeArbitrageBot.TotalFeeCosts);
            self.name = data.InterExchangeArbitrageBot.Name;
            self.updated = new Date();
        });
    }

    https.request(options, callback).end();

    setTimeout(function() {
        self.update();
    }, self.timeout);
};

module.exports = bot17;
