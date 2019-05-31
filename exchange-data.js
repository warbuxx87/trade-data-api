const fs = require('fs');


// Create UTF-8 Compliant JSON Streams
var iconv = require('iconv-lite');

// exchange data hash identifier
var xbinance = "b29d0acb-9a6e-49f2-8fd8-a137559f834c";
var xgemini = "6af0fee7-3ec5-4272-83c9-b56ffc6b2b73";
var xgdax = "ac055696-cafd-42e9-90a8-fb7ff62c488c";
var xpoloniex = "ea529fcb-ad7a-4ede-b808-62aa2de0a268";
var xbitstamp = "ae8941ca-f26c-48a6-a58c-d93f66464895";
var xbitfinex = "b34314bd-376b-47ce-b807-0d38885ed6e8";
var xbittrex = "00944920-a28f-4366-b65d-d61e6bef27ee";
var xkraken = "1fb3443b-33e9-4ab7-9cc4-2cdc088b8f49";

// Convert encoding streaming for binance
fs.createReadStream('/root/HTS/Simulations/' + xbinance + '_history.json')
	.pipe(iconv.decodeStream('utf-16'))
	.pipe(iconv.encodeStream('utf-8'))
	.pipe(fs.createWriteStream('/root/HTS/Simulations/binance.json'));

// Convert encoding streaming for gemini
fs.createReadStream('/root/HTS/Simulations/' + xgemini + '_history.json')
	.pipe(iconv.decodeStream('utf-16'))
	.pipe(iconv.encodeStream('utf-8'))
	.pipe(fs.createWriteStream('/root/HTS/Simulations/gemini.json'));

// Convert encoding streaming for gdax
fs.createReadStream('/root/HTS/Simulations/' + xgdax + '_history.json')
	.pipe(iconv.decodeStream('utf-16'))
	.pipe(iconv.encodeStream('utf-8'))
	.pipe(fs.createWriteStream('/root/HTS/Simulations/gdax.json'));

// Convert encoding streaming for poloniex
fs.createReadStream('/root/HTS/Simulations/' + xpoloniex + '_history.json')
	.pipe(iconv.decodeStream('utf-16'))
	.pipe(iconv.encodeStream('utf-8'))
	.pipe(fs.createWriteStream('/root/HTS/Simulations/poloniex.json'));

// Convert encoding streaming for bitstamp
fs.createReadStream('/root/HTS/Simulations/' + xbitstamp + '_history.json')
	.pipe(iconv.decodeStream('utf-16'))
	.pipe(iconv.encodeStream('utf-8'))
	.pipe(fs.createWriteStream('/root/HTS/Simulations/bitstamp.json'));

// Convert encoding streaming for bitfinex
fs.createReadStream('/root/HTS/Simulations/' + xbitfinex + '_history.json')
	.pipe(iconv.decodeStream('utf-16'))
	.pipe(iconv.encodeStream('utf-8'))
	.pipe(fs.createWriteStream('/root/HTS/Simulations/bitfinex.json'));

// Convert encoding streaming for bittrex
fs.createReadStream('/root/HTS/Simulations/' + xbittrex + '_history.json')
	.pipe(iconv.decodeStream('utf-16'))
	.pipe(iconv.encodeStream('utf-8'))
	.pipe(fs.createWriteStream('/root/HTS/Simulations/bittrex.json'));

// Convert encoding streaming for kraken
fs.createReadStream('/root/HTS/Simulations/' + xkraken + '_history.json')
	.pipe(iconv.decodeStream('utf-16'))
	.pipe(iconv.encodeStream('utf-8'))
	.pipe(fs.createWriteStream('/root/HTS/Simulations/kraken.json'));