const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

const host = '127.0.0.1';
const port = 3000;

var rooms = 0;
var all_rooms = [];

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

server.listen(port, host, function(){
    console.log('Server listening at : ' + host + ':' + port);
});

io.on('connection', (socket) => {
    socket.on('new', function(data){
        socket.join('room-'+ ++rooms);
		all_rooms.push('room-'+rooms);
        socket.emit('newGame', {name: data.name, room: 'room-'+rooms});
        console.log('Play 1 -> name : ' + data.name + ' - room : room-'+rooms);
    });

    socket.on('join', function(data){
        var room = io.nsps['/'].adapter.rooms[data.room];
        console.log('Play 2 -> name : ' + data.name + ' - room : ' + data.room);
        if(room && room.length == 1){
			var index = all_rooms.indexOf(data.room);
			if (index > -1) {
				all_rooms.splice(index, 1);
			}
            socket.join(data.room);
            socket.broadcast.to(data.room).emit('player1', {});
            socket.emit('player2', {name: data.name, room: data.room});            
        }
    });
	
	socket.on('turn', (data) => {
        socket.broadcast.to(data.room).emit('turnPlayed', {
            tile: data.tile,
            room: data.room
        });
    });
	
	socket.on('rooms', function(data){
	 	//socket.broadcast.emit('addRoom', data.room);
		socket.emit('allRooms', all_rooms);
	});	

	socket.on('end', (data) => {
        socket.broadcast.to(data.room).emit('gameEnd', data);
    });
    
    socket.on('disconnect', function () {
        io.emit('user disconnected');
    });
});