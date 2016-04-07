var numberMines = 10;
var columns = 8, rows = 8;
var field = [];
var countMoves;
var timer = 0;
var timerId;

window.onload=function(){
	var container = document.createElement("div");
	container.className = 'container';
	container.id = 'container';
	document.body.appendChild(container);
	
	var fieldView = document.createElement("div");
	fieldView.className = 'field';
	fieldView.id = 'field';
	container.appendChild(fieldView);
	
	//Create matrix of objects and add div element in it
	for(var i = 0; i < rows; i++){
		field[i] = [];
		for(var j = 0; j < columns; j++){
			(function (i,j) {
				var cell = document.createElement("div");
				cell.className = 'cell';
				fieldView.appendChild(cell);
				cell.addEventListener('click', function(){
					clickCell(i,j);
				});
				cell.addEventListener('contextmenu', function(ev){
					ev.preventDefault();
					rightClickCell(i,j);
				});
				field[i][j] = new Cell(i, j, cell);
			}(i,j));
		}
	}
	
	//Create element for counting open cells
	var counterView = document.createElement("div");
	counterView.id = 'counter';
	counterView.className = 'counter';
	container.appendChild(counterView);
	
	//Create element for timer
	var timerView = document.createElement("div");
	timerView.id = 'timer';
	timerView.className = 'timer';
	timerView.innerHTML = timer;
	container.appendChild(timerView);
	
	//Create element for starting new game
	var btnNewGame = document.createElement("div");
	btnNewGame.id = 'newgame';
	btnNewGame.className = 'buttonNewGame';
	btnNewGame.innerHTML = "New game";
	btnNewGame.addEventListener('click', function(){
		clearInterval(timerId);
		createField();
	});
	container.appendChild(btnNewGame);

	createField();
}

//Constructor for cells
function Cell(i, j, cellView){
	this.i = i;
	this.j = j;
	this.cellView = cellView;
	this.isBomb = false;
	this.isActive = false;
	this.countBombsAround = 0;
}

Cell.prototype.setCell = function(vallue){
	this.cellView.innerHTML = vallue;
}
	
Cell.prototype.isCell = function(value){
	return this.cellView.innerHTML == value;
}
	
Cell.prototype.changeCellActive = function(){
	this.isActive = !this.isActive;
	this.cellView.classList.toggle("active");
}
	
Cell.prototype.openCell = function(){
	if(!this.isActive){
		this.changeCellActive();
		this.setCell(this.countBombsAround);
	}
}
	
Cell.prototype.resetCell = function(){
	if(this.isActive){
		this.changeCellActive();
	}
	this.isBomb = false;
	this.countBombsAround = 0
	this.setCell("");
}

//Create new game
function createField(){
	countMoves = columns * rows - numberMines;
	document.getElementById("counter").innerHTML = "Empty cells to open: "+countMoves;
	
	timer = 0;
	document.getElementById("timer").innerHTML = "Time: "+timer;
	
	timerId = setInterval(function() {
		if(countMoves == 0){
			clearInterval(timerId);
		}else{
			timer++;
			document.getElementById("timer").innerHTML = "Time: "+timer;
		}
	}, 1000);
	
	for(var i = 0; i < rows; i++){
		for(j = 0; j < columns; j++){
			field[i][j].resetCell();
		}
	}

	for(var i = 0; i < numberMines; i++){
		var xy = randomCell();
		if(!field[xy[0]][xy[1]].isBomb){
			field[xy[0]][xy[1]].isBomb = true;
		}else {
			i--;
		}
	}
	
	for(var i = 0; i < rows; i++){
		for(j = 0; j < columns; j++){
			if(!field[i][j].isBomb){
				field[i][j].countBombsAround = countBombs(i, j);
			}
		}
	}
}

function randomCell(){
	return [Math.floor(Math.random() * 8), Math.floor(Math.random() * 8)];
}

//Return number of bombs around this cell
function countBombs(i, j){
	if(field[i][j].isBomb){
		return -1;
	}
	
	var count = 0;
	
	if(i > 0){
		if(j > 0 && field[i-1][j-1].isBomb){
			count++;
		}
		if(field[i-1][j].isBomb){
			count++;
		}
		if(j < columns-1 && field[i-1][j+1].isBomb){
			count++;
		}
	}
	
	if(j > 0 && field[i][j-1].isBomb){
		count++;
	}
	if(j < columns-1 && field[i][j+1].isBomb){
		count++;
	}
	
	if(i < rows-1){
		if(j > 0 && field[i+1][j-1].isBomb){
			count++;
		}
		if(field[i+1][j].isBomb){
			count++;
		}
		if(j < columns-1 && field[i+1][j+1].isBomb){
			count++;
		}
	}
	
	return count;
}

function clickCell(i, j){
	if(countMoves != 0 && !field[i][j].isActive)
	if(field[i][j].isBomb){
		endGame(false);
	}else{
		field[i][j].openCell();
		countMoves--;
		document.getElementById("counter").innerHTML = "Empty cells to open: "+countMoves;
		if(field[i][j].countBombsAround == 0){
			chain(i,j);
		}
		if(countMoves == 0){
			endGame(true);
		}
	}
}

//Open all cells around the one at i, j 
function chain(i, j){

	if(i > 0){
		if(j > 0 && !field[i-1][j-1].isActive){
			clickCell(i-1, j-1);
		}
		if(!field[i-1][j].isActive){
			clickCell(i-1, j);
		}
		if(j < columns-1 && !field[i-1][j+1].isActive){
			clickCell(i-1, j+1);
		}
	
	}
	
	if(j > 0 && !field[i][j-1].isActive){
		clickCell(i, j-1);
	}
	if(j < columns-1 && !field[i][j+1].isActive){
		clickCell(i, j+1);
	}
	
	if(i < rows-1 ){
		if(j > 0 && !field[i+1][j-1].isActive){
			clickCell(i+1, j-1);
		}
		if(!field[i+1][j].isActive){
			clickCell(i+1, j);
		}
		if(j < columns-1 && !field[i+1][j+1].isActive){
			clickCell(i+1, j+1);
		}
	}
}

//Place or remove flag on cell i, j 
function rightClickCell(i, j){
	if(countMoves != 0)
	if(!field[i][j].isActive){
		if(field[i][j].isCell("p")){
			field[i][j].setCell("");
		}else{
			field[i][j].setCell("p");
		}
	}
}

//Stop the game and show all bombs
function endGame(flag){
	for(i = 0; i < rows; i++){
		for(j = 0; j < columns; j++){
			if(field[i][j].isBomb){
				field[i][j].setCell("*");
			}
		}
	}
	countMoves = 0;
	alert(flag?"You win":"You lose");
}