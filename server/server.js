var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const PORT = process.env.PORT || 8000;
const path = require('path');

var players = [];
// var playerSpawnPoints = [[50, 50], [can.width-50, 0 + 50]];

app.get('/', (req, res, next) => {
	  res.sendFile(path.resolve('client/index.html'));
});

app.get('/game.js', (req, res, next) => {
	  res.sendFile(path.resolve('client/game.js'));
});

io.on('connection', function(socket) {
    console.log('Connection::' + socket.id);

    let newPlayer = new Player(socket.id);
    players.push(newPlayer);
    let randSpawnNum = Math.random();
    let spawnx = 0;
    let spawny = 0;
    if(randSpawnNum > .5) {
        spawnx = 50;
        spawny = 50;
    } else {
        spawnx = 150;
        spawny = 150;
    }
    newPlayer.spawn(spawnx, spawny);

    socket.emit('currentPlayer', newPlayer);

    io.emit('updatePositions', players);

    console.log(players);

    socket.on('newPositions', data => {
        players = data;
    });

    socket.on('disconnect', function() {
        for(let i = 0; i < players.length; i++) {
            if(players[i].id == socket.id) {
                players.splice(i);
            }
        }
        io.emit('updatePositions', players);
   		console.log('Disconnection::' + socket.id);
        console.log(players);
   	});
});

http.listen(PORT, function(){
    console.log('Server listening on port ' + PORT);
});

function Player(id) {
    this.id = id;
    this.x = null;
    this.y = null;

    this.spawn = function(x, y) {
        this.x = x;
        this.y = y;
        // io.emit('spawnPlayer', this.id);
    }
}