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
		ctx.fillStyle = 'red';
		ctx.fillRect(players[i].x, players[i].y, 50, 50);	
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
			socket.emit('keyPress', {
				inputId: 'left'
			})

			break;
        case 38: 
			socket.emit('keyPress', {
				inputId: 'up'
			})
	        
        	break;
        case 39: 
			socket.emit('keyPress', {
				inputId: 'right'
			})
	        
        	break;
        case 40: 
			socket.emit('keyPress', {
				inputId: 'down'
			})
	        
        	break;
        default: 
        	break;
	}
});

// class Game {
// 	constructor() {
// 		this.map = new Map(10, 12);

// 		this.map.generate();
// 		this.map.randomise();
// 		this.map.draw();

// 		this.player = new Player();

// 		this.player.draw();

// 		window.addEventListener('keydown', (e) => {
// 			var keyCode = e.keyCode;

// 			switch (keyCode) {
// 				case 37:
// 					if (this.player.x > 0) {						
// 						if (this.map.layout[this.player.x - 1][this.player.y] == 0) {
// 							this.player.move('left'); 
// 						}
// 					}

// 					break;
// 		        case 38: 
// 			        if (this.player.y > 0) {
// 			        	if (this.map.layout[this.player.x][this.player.y - 1] == 0) {
// 		        			this.player.move('up'); 
// 		        		}
// 			        }
			        
// 		        	break;
// 		        case 39: 
// 			        if (this.player.x < this.map.width - 1) {
//     		        	if (this.map.layout[this.player.x + 1][this.player.y] == 0) {
//     	        			this.player.move('right'); 
//     	        		}
// 			        }
			        
// 		        	break;
// 		        case 40: 
// 			        if (this.player.y < this.map.height - 1) {
//     		        	if (this.map.layout[this.player.x][this.player.y + 1] == 0) {
//     	        			this.player.move('down'); 
//     	        		}
// 			        }
			        
// 		        	break;
// 		        default: 
// 		        	break;
// 			}
// 		});
// 	}

// 	update() {
// 		window.requestAnimationFrame(this.update.bind(this));
// 		ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

// 		this.map.update();
// 		this.player.update();
// 	}
// }

// class Map {
// 	constructor(width, height) {
// 		this.width = width;
// 		this.height = height;

// 		this.layout = [];
// 	}

// 	generate() {
// 		var layout = []

// 		for (var i = 0; i < this.width; i++) {
// 			layout[i] = []

// 			for (var j = 0; j < this.height; j++) {
// 				layout[i][j] = 0;
// 			}
// 		}

// 		this.layout = layout;
// 	}

// 	randomise() {
// 		var layout = this.layout;

// 		layout[Math.floor(Math.random() * this.width)][Math.floor(Math.random() * this.height)] = 1;
// 		layout[Math.floor(Math.random() * this.width)][Math.floor(Math.random() * this.height)] = 1;		
// 		layout[Math.floor(Math.random() * this.width)][Math.floor(Math.random() * this.height)] = 1;
// 		layout[Math.floor(Math.random() * this.width)][Math.floor(Math.random() * this.height)] = 1;

// 		layout[Math.floor(Math.random() * this.width)][Math.floor(Math.random() * this.height)] = 2;
		
// 		this.layout = layout;
// 	}

// 	draw() {
// 		for (var i = 0; i < this.width; i++) {
// 			for (var j = 0; j < this.height; j++) {
// 				ctx.fillStyle = colorKey[this.layout[i][j]];
// 				ctx.fillRect(i * 50, j * 50, 49, 49);
// 			}
// 		}
// 	}

// 	update() {
// 		this.draw();		
// 	}
// }

// class Player {
// 	constructor() {
// 		this.x = 0;
// 		this.y = 0;	
// 	}

// 	move(direction) {
// 		switch (direction) {
// 			case 'left': 
// 				this.x -= 1;				
// 				break;
// 	        case 'up': 
// 	        	this.y -= 1;
// 	        	break;
// 	        case 'right': 
// 	        	this.x += 1;
// 	        	break;
// 	        case 'down': 
// 	        	this.y += 1;
// 	        	break;
// 	        default: 
// 	        	break;
// 		}
// 	}

// 	draw() {
// 		ctx.fillStyle = colorKey[mapKey['player']];
// 		ctx.fillRect(this.x * 50, this.y * 50, 49, 49);
// 	}

// 	update() {
// 		this.draw();
// 	}
// }

// var GAME = new Game();
// GAME.update();