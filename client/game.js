var can = document.getElementById("can");
var ctx = can.getContext("2d");
can.width = window.innerWidth / 2;
can.height = window.innerHeight / 2;
can.style.border = "1px black solid";
var userPlayer;
var playersList = [];

var spawnpoints = [[50, 50], [can.width-50, 0 + 50]]

socket.on('currentPlayer', player => {
	userPlayer = new UserPlayer();
	userPlayer.id = player.id;
	userPlayer.x = player.x;
	userPlayer.y = player.y;
	// console.log(userPlayer);

	can.addEventListener('mousedown', e => {
		let style = document.querySelector("body").currentStyle || window.getComputedStyle(document.querySelector("body"));
		let x = e.x - parseInt(window.pageXOffset + can.getBoundingClientRect().left);
		let y = e.y - parseInt(window.pageYOffset + can.getBoundingClientRect().top);
		let data = {
			x,
			y
		}

		userPlayer.move(x, y);
	});
});

socket.on('updatePositions', players => {
	updatePositions(players);
});

function UserPlayer() {
	this.id = null;
	this.x = null;
	this.y = null;

	this.move = function(mouseX, mouseY) {
		// console.log(mouseX, mouseY);
		if(mouseX > userPlayer.x) {
			for(play of playersList) {
				if(play.id == userPlayer.id) {
					play.x += 10;
				}
			}
			userPlayer.x += 10;
			// console.log("hi");
		} else {
			for(play of playersList) {
				if(play.id == userPlayer.id) {
					play.x -= 10;
				}
			}
			userPlayer.x -= 10;
		}

		if(mouseY > userPlayer.y) {
			for(play of playersList) {
				if(play.id == userPlayer.id) {
					play.y += 10;
				}
			}
			userPlayer.y += 10;
		} else {
			for(play of playersList) {
				if(play.id == userPlayer.id) {
					play.y -= 10;
				}
			}
			userPlayer.y -= 10;
		}

		socket.emit('newPositions', playersList);

		// console.log(playersList);
		updatePositions(playersList);

	}
}

function updatePositions(players) {
	playersList = players;
	ctx.clearRect(0, 0, can.width, can.height);

	for(player of players) {
		console.log(player);

		ctx.beginPath();
		ctx.fillStyle = "red";
		ctx.ellipse(player.x, player.y, 50, 50, Math.PI / 4,0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();
	}
}

// socket.on('createUser', id => {
// 	players.push(new Player(id))
// });

// socket.on('showAllPlayers', e => {
// 	console.log(players);
// })

// function Player(id) {
// 	this.id = id;
// 	this.x = null;
// 	this.y = null;

// 	this.spawn = function() {
// 		ctx.beginPath();
// 		ctx.fillStyle = "red";
// 		let num = Math.random();
// 		let spawn = [];
// 		if (num > .5) {
// 			this.x = spawnpoints[0][0];
// 			this.y = spawnpoints[0][1];
// 		} else if(num <= .5) {
// 			this.x = spawnpoints[1][0];
// 			this.y = spawnpoints[1][1];
// 		}
// 		ctx.ellipse(this.x, this.y, 50, 50, Math.PI / 4, 0, 2 * Math.PI);
// 		ctx.fill();
// 		ctx.stroke();
// 		console.log(this.id);
// 		can.addEventListener('mousedown', e => {
// 			let style = document.querySelector("body").currentStyle || window.getComputedStyle(document.querySelector("body"));
// 			let x = e.x - parseInt(window.pageXOffset + can.getBoundingClientRect().left);
// 			let y = e.y - parseInt(window.pageYOffset + can.getBoundingClientRect().top);
// 			let data = {
// 				x,
// 				y
// 			}
// 		    socket.emit('mousedown', data);
// 		});
// 	}

// 	this.spawn();
// }