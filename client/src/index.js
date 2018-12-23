'use-strict';

import io from 'socket.io-client';

import './index.scss';

if (process.env.NODE_ENV === 'development' && module.hot) {
	module.hot.accept();
}

var canvas = document.querySelector('#canvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var socket = io('http://localhost:8000');

socket.on('update', (data) => {
	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

	var players = data.players;

	for (var i = 0; i < players.length; i++) {
		ctx.fillStyle = colorKey[mapKey['player']];
		ctx.fillRect(players[i].x, players[i].y, players[i].width, players[i].height);	
	}
});

window.addEventListener('resize', (e) => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});

var mapKey = {
	'empty': 0,
	'blocked': 1,
	'goal': 2,
	'player': 3,
}

var colorKey = {
	0: 'black',
	1: 'white',
	2: 'red',
	3: 'blue',
}

window.addEventListener('keydown', (e) => {
	var keyCode = e.keyCode;

	switch (keyCode) {
		case 37:
			socket.emit('keydown', {
				inputId: 'left'
			})

			break;
        case 38: 
			socket.emit('keydown', {
				inputId: 'up'
			})
	        
        	break;
        case 39: 
			socket.emit('keydown', {
				inputId: 'right'
			})
	        
        	break;
        case 40: 
			socket.emit('keydown', {
				inputId: 'down'
			})
	        
        	break;
        default: 
        	break;
	}
});

window.addEventListener('keyup', (e) => {
	var keyCode = e.keyCode;

	switch (keyCode) {
		case 37:
			socket.emit('keyup', {
				inputId: 'left'
			})

			break;
        case 38: 
			socket.emit('keyup', {
				inputId: 'up'
			})
	        
        	break;
        case 39: 
			socket.emit('keyup', {
				inputId: 'right'
			})
	        
        	break;
        case 40: 
			socket.emit('keyup', {
				inputId: 'down'
			})
	        
        	break;
        default: 
        	break;
	}	
})