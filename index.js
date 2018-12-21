'use strict';

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const webpackConfig = require('./webpack.config.dev.js');
const compiler = webpack(webpackConfig);

const app = express();

app.use(webpackDevMiddleware(compiler, webpackConfig.devServer));
app.use(webpackHotMiddleware(compiler, {
    log: console.log
}));

app.use('/static', express.static(path.join(__dirname, 'client/dist/static')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

// app.listen(APP_PORT, () => {
//     console.log(`App listening on port ${APP_PORT}`);
// });

const server = http.Server(app);
const APP_PORT = 8000;

server.listen(APP_PORT, () => {
    console.log(`App listening on port ${APP_PORT}`);
});

const SOCKETS = {}
const PLAYERS = {}

function Player(id, x, y) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.dx = 0;
	this.dy = 0;
	this.maxSpeed = 10;
}

Player.prototype = {
	update: function() {
		this.x += this.dx;
		this.y += this.dy;
	},

	onConnect: function(socket) {
		PLAYERS[socket.id] = this;

		socket.on('keydown', (socket) => {
			if (socket.inputId == 'left') this.dx = -this.maxSpeed;
			if (socket.inputId == 'up') this.dy = -this.maxSpeed;
			if (socket.inputId == 'right') this.dx = this.maxSpeed;
			if (socket.inputId == 'down') this.dy = this.maxSpeed;
		})

		socket.on('keyup', (socket) => {
			if (socket.inputId == 'left') this.dx = 0;
			if (socket.inputId == 'up') this.dy = 0;
			if (socket.inputId == 'right') this.dx = 0;
			if (socket.inputId == 'down') this.dy = 0;
		})
	},

	onDisconnect: function(socket) {
		delete PLAYERS[socket.id];
	}	
}

const io = socketIO(server);

io.on('connection', (socket) => {
	socket.id = Math.random();
	SOCKETS[socket.id] = socket;

	var player = new Player(socket.id, 100, 100);
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
			y: player.y
		});
	}

	for (var i in SOCKETS) {
		var socket = SOCKETS[i];
		socket.emit('update', data);
	}

}, 1000/60); 