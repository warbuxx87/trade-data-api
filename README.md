# Trade Data API

> Node.js service that collects trade data from 9 exchanges and serves it through a paginated REST API. Express · NeDB.

<p>
<img src="https://img.shields.io/badge/Node.js-5FA04E?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js" />
<img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
</p>

Collects executed trades from Binance, Bitfinex, Bitstamp, Bittrex, Coinbase (GDAX), Gemini, HitBTC, Kraken and Poloniex, stores them locally and exposes them through a paginated REST API.

## How it works

- `exchanges/` has a connector per venue, with retry and timeout handling for unreliable exchange APIs.
- `trades/` and `history/` track the activity of each strategy worker ("bot").
- `exchange-data.js` and `trades.js` serve the data through Express with `express-paginate`, using `toobusy-js` for back-pressure.
- Storage is embedded NeDB, so there's no external database to run.

## Stack

Node.js, Express

## Running locally

```bash
npm install
node exchange-data.js
```

## Credits

Built by me at Alkemi, 2018–2019 (254 commits).

---
<sub>Part of <a href="https://github.com/warbuxx87">Ryan Breen's</a> work · <a href="https://www.linkedin.com/in/breen-ryan/">LinkedIn</a></sub>
