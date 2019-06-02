'use strict';

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

// const webpack = require('webpack');
// const webpackDevMiddleware = require('webpack-dev-middleware');
// const webpackHotMiddleware = require('webpack-hot-middleware');

// const webpackConfig = require('../../webpack.config.js');
// const compiler = webpack(webpackConfig);

const app = express();

// app.use(webpackDevMiddleware(compiler, webpackConfig.devServer));
// app.use(
// 	webpackHotMiddleware(compiler, {
// 		log: console.log
// 	})
// );

app.use('/static', express.static(path.join(__dirname, '../client/static')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/index.html'));
});

const server = http.Server(app);
const APP_PORT = 8000;

server.listen(APP_PORT, () => {
	console.log(`App listening on port ${APP_PORT}`);
});

const SOCKETS = {};
const PLAYERS = {};

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
	update: function() {
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

	onConnect: function(socket) {
		PLAYERS[socket.id] = this;

		socket.on('keydown', socket => {
			this.keydown[socket.inputId] = true;
		});

		socket.on('keyup', socket => {
			this.keydown[socket.inputId] = false;
		});
	},

	onDisconnect: function(socket) {
		delete PLAYERS[socket.id];
	}
};

const io = socketIO(server);

io.on('connection', socket => {
	socket.id = Math.random();
	SOCKETS[socket.id] = socket;

	var player = new Player(socket.id, 100, 100, 50, 50);
	player.onConnect(socket);

	socket.on('disconnect', () => {
		delete SOCKETS[socket.id];
		player.onDisconnect(socket);
	});
});

setInterval(() => {
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
