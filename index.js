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
}

Player.prototype = {
	onConnect: function(socket) {
		PLAYERS[socket.id] = this;

		socket.on('keyPress', (socket) => {
			var x = this.x;
			var y = this.y;

			if (socket.inputId == 'left') x--
			if (socket.inputId == 'up') y--
			if (socket.inputId == 'right') x++
			if (socket.inputId == 'down') y++ 

			this.x = x;
			this.y = y;
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

}, 1000/30); 