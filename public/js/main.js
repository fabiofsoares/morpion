const p1 = 'x',
p2 = 'y',
socket = io.connect('http://127.0.0.1:3000');

let player = '',
game = '',
rooms = '';

let join_section = document.getElementById('join_section');

(function(){

    document.getElementById('btn_new').addEventListener('click', function(e){
        var name = document.getElementById('input_player_1').value;
        if(!name){
           alert('Veuillez écrire votre prenom :');
           return;
        }
        socket.emit('new', {name:name});
        player = new Player(name, p1);
        
    });
	document.getElementById('btn_restart').addEventListener('click', function(){
		var pop = document.getElementById('pop_end');
		pop.classList.toggle('off');
		location.reload();
	})
	function joinRoom(){
		let btns_room = document.querySelectorAll('.btn_room');
		for(var i = 0; i < btns_room.length; i++){
			btns_room[i].addEventListener('click', function(){
				var name = document.getElementById('input_player_2').value;
				var room = this.id;
				if(!name){
					alert('Veuillez sasir votre prenom!');
					return;
				}				
				socket.emit('join', {name: name, room: room});        
				player = new Player(name, p2);				
			})
		}
	}

    socket.on('newGame', function(data){
		var message = 'Salut, ' + data.name + '! Demmandez a votre amis pour se connecter à la ' + data.room;
		player.setCourrentTurn(false);
        game = new Game(data.room);
        game.displayBoard(message);
			
    });
	
    socket.on('player1', function(data){
        var message = 'Salut, ' + player.getName();
        document.getElementById('player_name').innerText = message;        
        player.setCourrentTurn(true);
        console.log('Objet Player 1 : ', player);
    });

    socket.on('player2', function(data){
        var message = 'Salut, ' + data.name;       
        game = new Game(data.room);
        game.displayBoard(message);
        player.setCourrentTurn(false);
        console.log('Objet Player 2 : ', player);
    })

    socket.on('turnPlayed', function(data){
        console.log('turn main, ', data);
        var opponent = player.getType() == p1 ? p2 : p1;
        game.updateBoard(opponent, data.tile);
        player.setCourrentTurn(true);
    })	

	socket.emit('rooms');	
	
	socket.on('allRooms', function(data){
		rooms = data;
		
		if(rooms != ''){
			for(var i = 0; i < rooms.length; i++){
				join_section.classList.remove('off');
				var text = document.createTextNode(rooms[i]);
				var btn_room = document.createElement('div')
				btn_room.setAttribute('id', rooms[i]);
				btn_room.setAttribute('class', 'btn_room');
				btn_room.appendChild(text);
				var content = document.getElementById('rooms');
				content.appendChild(btn_room);
			}
			
		}
		else{
			join_section.classList.add('off');
		}
		console.log('Rooms', data);		
		joinRoom();
	})
	
	socket.on('gameEnd', function(data){
		game.endGame(data.message);
		socket.leave(data.room);
	})
	
	socket.on('err', function(data){
		game.endGame(data.message);
	})

	
    
})();

