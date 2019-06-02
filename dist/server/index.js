/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/server/index.js":
/*!*****************************!*\
  !*** ./src/server/index.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var express = __webpack_require__(/*! express */ "express");
var http = __webpack_require__(/*! http */ "http");
var socketIO = __webpack_require__(/*! socket.io */ "socket.io");
var path = __webpack_require__(/*! path */ "path");

// const webpack = require('webpack');
// const webpackDevMiddleware = require('webpack-dev-middleware');
// const webpackHotMiddleware = require('webpack-hot-middleware');

// const webpackConfig = require('../../webpack.config.js');
// const compiler = webpack(webpackConfig);

var app = express();

// app.use(webpackDevMiddleware(compiler, webpackConfig.devServer));
// app.use(
// 	webpackHotMiddleware(compiler, {
// 		log: console.log
// 	})
// );

app.use('/static', express.static(path.join(__dirname, '../client/static')));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '../client/index.html'));
});

var server = http.Server(app);
var APP_PORT = 8000;

server.listen(APP_PORT, function () {
	console.log('App listening on port ' + APP_PORT);
});

var SOCKETS = {};
var PLAYERS = {};

function Player(id, x, y, width, height) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.dx = 0;
	this.dy = 0;
	this.width = width;
	this.height = height;
	this.maxSpeed = 10;

	this.pressLeft = false;
	this.pressUp = false;
	this.pressRight = false;
	this.pressDown = false;

	this.keydown = {
		left: false,
		up: false,
		right: false,
		down: false
	};

	this.collision = {
		left: false,
		up: false,
		right: false,
		down: false
	};
}

Player.prototype = {
	update: function update() {
		if (this.keydown['left']) {
			this.dx = -this.maxSpeed;
		} else {
			if (this.dx >= -this.maxSpeed && this.dx < 0) {
				this.dx++;
			}
		}

		if (this.keydown['up']) {
			this.dy = -this.maxSpeed;
		} else {
			if (this.dy >= -this.maxSpeed && this.dy < 0) {
				this.dy++;
			}
		}

		if (this.keydown['right']) {
			this.dx = this.maxSpeed;
		} else {
			if (this.dx <= this.maxSpeed && this.dx > 0) {
				this.dx--;
			}
		}

		if (this.keydown['down']) {
			this.dy = this.maxSpeed;
		} else {
			if (this.dy <= this.maxSpeed && this.dy > 0) {
				this.dy--;
			}
		}

		this.x += this.dx;
		this.y += this.dy;
	},

	onConnect: function onConnect(socket) {
		var _this = this;

		PLAYERS[socket.id] = this;

		socket.on('keydown', function (socket) {
			_this.keydown[socket.inputId] = true;
		});

		socket.on('keyup', function (socket) {
			_this.keydown[socket.inputId] = false;
		});
	},

	onDisconnect: function onDisconnect(socket) {
		delete PLAYERS[socket.id];
	}
};

var io = socketIO(server);

io.on('connection', function (socket) {
	socket.id = Math.random();
	SOCKETS[socket.id] = socket;

	var player = new Player(socket.id, 100, 100, 50, 50);
	player.onConnect(socket);

	socket.on('disconnect', function () {
		delete SOCKETS[socket.id];
		player.onDisconnect(socket);
	});
});

setInterval(function () {
	var data = {
		players: []
	};

	for (var i in PLAYERS) {
		var player = PLAYERS[i];
		player.update();

		data.players.push({
			id: player.id,
			x: player.x,
			y: player.y,
			width: player.width,
			height: player.height
		});
	}

	for (var i in SOCKETS) {
		var socket = SOCKETS[i];
		socket.emit('update', data);
	}
}, 1000 / 60);

/***/ }),

/***/ 0:
/*!***********************************!*\
  !*** multi ./src/server/index.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./src/server/index.js */"./src/server/index.js");


/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ })

/******/ });
//# sourceMappingURL=index.js.map