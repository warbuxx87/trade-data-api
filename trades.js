#!/bin/env node

var toobusy = require('toobusy-js');
var express = require('express');
var fs = require('fs');

// Bot Performance
var bot1 = require('./trades/bot1');
var bot2 = require('./trades/bot2');
var bot3 = require('./trades/bot3');
var bot4 = require('./trades/bot4');
var bot5 = require('./trades/bot5');
var bot6 = require('./trades/bot6');
var bot7 = require('./trades/bot7');
var bot8 = require('./trades/bot8');
var bot9 = require('./trades/bot9');
var bot10 = require('./trades/bot10');
var bot11 = require('./trades/bot11');
var bot12 = require('./trades/bot12');
var bot13 = require('./trades/bot13');
var bot14 = require('./trades/bot14');
var bot15 = require('./trades/bot15');
var bot16 = require('./trades/bot16');
var bot17 = require('./trades/bot17');
var bot18 = require('./trades/bot18');
var bot19 = require('./trades/bot19');
var bot20 = require('./trades/bot20');

// Simulated exchanges
var sim1 = require('./trades/sim1');
var sim2 = require('./trades/sim2');
var sim3 = require('./trades/sim3');
var sim4 = require('./trades/sim4');
var sim5 = require('./trades/sim5');
var sim6 = require('./trades/sim6');
var sim7 = require('./trades/sim7');

// Aggregated Stats
var stats = require('./trades/stats');

// Aggregated trades
var bots = require('./history/bots');

/**
 *  Define the application.
 */
var TradeMonitor = function() {

	//  Scope.
	var self = this;


	/*  ================================================================  */
	/*  Helper functions.                                                 */
	/*  ================================================================  */

	/**
	 *  Set up server IP address and port # using env variables/defaults.
	 */
	self.setupVariables = function() {
		//  Set the environment variables we need.
		self.host = "api.alkemi.ai"
		self.ipaddress = "0.0.0.0";
		self.port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

		if (typeof self.ipaddress === "undefined") {
			//  Log errors but continue w/ 127.0.0.1 - this
			//  allows us to run/test the app locally.
			console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
			self.ipaddress = "127.0.0.1";
		};
	};



	/**
	 *  terminator === the termination handler
	 *  Terminate server on receipt of the specified signal.
	 *  @param {string} sig  Signal to terminate on.
	 */
	self.terminator = function(sig) {
		if (typeof sig === "string") {
			console.log('%s: Received %s - terminating trades app ...',
				Date(Date.now()), sig);
			process.exit(1);
		}
		console.log('%s: Node server stopped.', Date(Date.now()));
	};


	/**
	 *  Setup termination handlers (for exit and a list of signals).
	 */
	self.setupTerminationHandlers = function() {
		//  Process on exit and signals.
		process.on('exit', function() {
			self.terminator();
		});

		// Removed 'SIGPIPE' from the list - bugz 852598.
		['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
			'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
		].forEach(function(element, index, array) {
			process.on(element, function() {
				self.terminator(element);
			});
		});
	};

	/*  ================================================================  */
	/*  App server functions (main app logic here).                       */
	/*  ================================================================  */

	/**
	 *  Create the routing table entries + handlers for the application.
	 */
	self.createRoutes = function() {
		self.routes = {};

		self.routes['/'] = function(req, res) {
			res.setHeader('Content-Type', 'application/json');
			res.setHeader('Cache-Control', 'no-cache, no-store');
			res.end(JSON.stringify({
				bots: [self.bot1, self.bot2, self.bot3, self.bot4, self.bot5, self.bot6, self.bot7,
					self.bot8, self.bot9, self.bot10, self.bot11, self.bot12, self.bot13, self.bot14,
					self.bot15, self.bot16, self.bot17, self.bot18, self.bot19, self.bot20
				],
				exchanges: [self.sim1, self.sim2, self.sim3, self.sim4, self.sim5, self.sim6, self.sim7],
				stats: [self.stats]
			}));
		};

		self.routes['/bots'] = function(req, res) {
			res.setHeader('Content-Type', 'application/json');
			res.setHeader('Cache-Control', 'no-cache, no-store');
			res.end(JSON.stringify({
				meta: {
					page: 1,
					pages: 1,
					perpage: -1,
					total: self.bots.total,
					sort: "desc",
					field: "AddedTime"
				},
				data: self.bots.trades
			}));
		};

		self.routes['/exchange'] = function(req, res) {
			res.setHeader('Content-Type', 'application/json');
			res.setHeader('Cache-Control', 'no-cache, no-store');
			res.end(JSON.stringify({
				meta: {
					page: 1,
					pages: 1,
					perpage: -1,
					total: self.sim1.total,
					sort: "desc",
					field: "AddedTime"
				},
				data: self.sim1.data.SpotOrders
			}));
		};


	};


	/**
	 *  Initialize the server (express) and create the routes and register
	 *  the handlers.
	 */
	self.initializeServer = function() {
		self.createRoutes();
		self.app = express();

		self.app.use(express.static('public'));

		//  Add handlers for the app (from the routes).
		for (var r in self.routes) {
			self.app.get(r, self.routes[r]);

		}
	};


	/**
	 *  Initializes the application.
	 */
	self.initialize = function() {
		self.setupVariables();
		self.setupTerminationHandlers();

		// Create the express server and routes.
		self.initializeServer();
	};


	/**
	 *  Start the server (starts up the sample application).
	 */
	self.start = function() {
		//  Start the app on the specific interface (and port).
		self.app.listen(self.port, self.ipaddress, function() {
			console.log('%s: Node server started on %s:%d ...',
				Date(Date.now()), self.ipaddress, self.port);
		});

		//bots
		self.bot1 = new bot1();
		self.bot2 = new bot2();
		self.bot3 = new bot3();
		self.bot4 = new bot4();
		self.bot5 = new bot5();
		self.bot6 = new bot6();
		self.bot7 = new bot7();
		self.bot8 = new bot8();
		self.bot9 = new bot9();
		self.bot10 = new bot10();
		self.bot11 = new bot11();
		self.bot12 = new bot12();
		self.bot13 = new bot13();
		self.bot14 = new bot14();
		self.bot15 = new bot15();
		self.bot16 = new bot16();
		self.bot17 = new bot17();
		self.bot18 = new bot18();
		self.bot19 = new bot19();
		self.bot20 = new bot20();

		// sim exchanges for bots
		self.sim1 = new sim1();
		self.sim2 = new sim2();
		self.sim3 = new sim3();
		self.sim4 = new sim4();
		self.sim5 = new sim5();
		self.sim6 = new sim6();
		self.sim7 = new sim7();

		// aggregate stats
		self.stats = new stats();
		self.bots = new bots();
	};

}; /*  Trade Monitor.  */



/**
 *  main():  Main code.
 */
var zapp = new TradeMonitor();
zapp.initialize();
zapp.start();
