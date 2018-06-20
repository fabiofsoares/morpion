class Game {
    constructor(room, player){
        this.room = room;        
        this.moves = 0;
        this.player = player;		
    }
	setMoves(moves){
		this.moves += moves;
	}
	getMoves(){
		return this.moves;
	}
    getRoom(){
        return this.room;
    }
    displayBoard(message){
        document.getElementById('home').classList.toggle('off');
        document.getElementById('board').classList.toggle('off');
		var player_name = document.createTextNode(message);		
        document.getElementById('player_name').appendChild(player_name);
        this.createGameBoard();
    }	
    createGameBoard(){
        var btns = document.querySelectorAll('.square');
		var game = this;
        for(var i = 0; i < btns.length; i++){
            btns[i].addEventListener('click', function(){               
                if(!player.getCourrentTurn()){
                    alert('Its not your turn!');
                    return;
                }
                if(this.disabled){
                    alert('This tile has alredy been played on!')
                }
                game.playTurn(this);
				game.setMoves(1);
                console.log('id : ', this.id)
                game.updateBoard(player.getType(), this.id);
				player.updateMovesPlayed(1);
                player.setCourrentTurn(false);
				console.log('game moves ', game.getMoves());
				if(game.getMoves() == 14){
					game.endGame('JEU NULL');					
				}
				if(player.getMovesPlayed() >= 3){
					game.checkWinner(player.getType());
				}
				
            })
        }
    }
    updateBoard(type, tile){        
        var btn_case = document.getElementById(tile);
        btn_case.classList.add(type);
        btn_case.disabled = true;
        this.moves++;
    }
    playTurn(tile){
        //console.log('tile : ', tile);
        //var btn = document.getElementById(tile).id;
        socket.emit('turn', {
            tile: tile.id,
            room: this.getRoom(),
        });
    }
	checkWinner(type){
		var cases = document.querySelectorAll('.square.' + type);
		var ids = [];
		var win = false;
		for(var i = 0; i < cases.length; i++){
			var id = cases[i].id.split('btn_')
			ids.push(parseInt(id[1]));
		}
		console.log(ids);
		if((ids.includes(1) && ids.includes(2) && ids.includes(3)) || 
		   (ids.includes(4) && ids.includes(5) && ids.includes(6)) ||
		   (ids.includes(7) && ids.includes(8) && ids.includes(9)) ||
		   (ids.includes(1) && ids.includes(4) && ids.includes(7)) ||
		   (ids.includes(2) && ids.includes(5) && ids.includes(8)) ||
		   (ids.includes(3) && ids.includes(6) && ids.includes(9)) ||
		   (ids.includes(1) && ids.includes(5) && ids.includes(9)) ||
		   (ids.includes(3) && ids.includes(5) && ids.includes(7)))
		{
			console.log('WINNER');
			win = true;
			this.annonceWinner();
		} else {
			console.log('RIEN DU TOUT');
		}
	}
	annonceWinner(){
		var message = player.getName() + ' est le gagnant !';
		socket.emit('end', {room: this.getRoom(), message: message});
		this.endGame(message);
	}
	endGame(message){
		var pop = document.getElementById('pop_end');
		pop.classList.toggle('off');
		var pop_message = document.getElementById('message_end');
		pop_message.innerHTML = message;		
	}
}