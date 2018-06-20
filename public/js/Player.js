class Player  {
    constructor(name, type) {
        this.name = name;
        this.type = type;
        this.courrentTurn = true;
        this.movesPlayed = 0;
    }

    static wins(){
        return [7, 56, 448, 73, 146, 292, 273, 84];
    }    
    getName(){
        return this.name;
    }
    getType(){
        return this.type;
    }
    getCourrentTurn(){
        return this.courrentTurn;
    }
    setCourrentTurn(turn){
        this.courrentTurn = turn;
        if(turn){
            document.getElementById('turn').innerText = 'Your turn !';
        }
        else {
            document.getElementById('turn').innerText = 'Waiting for your opponent';
        }
    }
    getMovesPlayed(){
        return this.movesPlayed;
    }    
    updateMovesPlayed(titleValue){
        this.movesPlayed += titleValue;
    }

}