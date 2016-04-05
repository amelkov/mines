var numberMines = 10;
var columns = 8, rows = 8;
var field = [];
var countMoves;

var container = document.createElement("div");
container.className = 'container';
container.id = 'container';
document.body.appendChild(container);

var fieldView = document.createElement("div");
fieldView.className = 'field';
fieldView.id = 'field';
container.appendChild(fieldView);

for(i = 0; i < rows; i++){
	for(j = 0; j < columns; j++){
		(function (i,j) {
			var cell = document.createElement("div");
			cell.className = 'cell';
			cell.id = 'cell'+i+j;
			fieldView.appendChild(cell);
			cell.addEventListener('click', function(){clickCell(i,j)});
			cell.addEventListener('contextmenu', function(ev){ev.preventDefault(); rightClickCell(i,j);});
		}(i,j));
	}
}

var testCounter = document.createElement("div");
testCounter.id = 'counter';
testCounter.className = 'counter';
testCounter.innerHTML = countMoves;
container.appendChild(testCounter);

var btnNewGame = document.createElement("div");
btnNewGame.id = 'newgame';
btnNewGame.className = 'buttonNewGame';
btnNewGame.innerHTML = "New game";
btnNewGame.addEventListener('click', function(){createField();});
container.appendChild(btnNewGame);

createField();

function createField(){
	countMoves = columns * rows - numberMines;
	document.getElementById("counter").innerHTML = "Empty cells to open: "+countMoves;
	
	for(i = 0; i < rows; i++){
		field[i] = [];
		for(j = 0; j < columns; j++){
			field[i][j] = 0;
			setCell(i,j,"");
		}
	}

	for(i = 0; i < numberMines; i++){
		var xy = randomCell();
		if(field[xy[0]][xy[1]] == 0){
			field[xy[0]][xy[1]] = -1;
		}else {i--;}
	}
	
	for(i = 0; i < rows; i++){
		for(j = 0; j < columns; j++){
			if(field[i][j] != -1){
				field[i][j] = countMines(i,j);
			}
		}
	}
}

function randomCell(){
	return [Math.floor(Math.random() * 8), Math.floor(Math.random() * 8)];
}

function countMines(i,j){
	if(field[i][j] == -1){return -1;}
	
	var count = 0;
	
	if(i > 0 && j > 0 && field[i-1][j-1] == -1){count++;}
	if(i > 0 && field[i-1][j] == -1){count++;}
	if(i > 0 && j < columns-1 && field[i-1][j+1] == -1){count++;}
	
	if(j > 0 && field[i][j-1] == -1){count++;}
	if(j < columns-1 && field[i][j+1] == -1){count++;}
	
	if(i < rows-1 && j > 0 && field[i+1][j-1] == -1){count++;}
	if(i < rows-1 && field[i+1][j] == -1){count++;}
	if(i < rows-1 && j < columns-1 && field[i+1][j+1] == -1){count++;}
	
	return count;
}

function clickCell(i,j){
	if(countMoves != 0)
	if(field[i][j] == -1){
		endGame(false);
	}else if(isCellVallue(i,j,"")){
		setCell(i,j,field[i][j]);
		countMoves--;
		document.getElementById("counter").innerHTML = "Empty cells to open: "+countMoves;
		if(field[i][j] == 0){chain(i,j);}
		if(countMoves == 0){endGame(true);}
	}
}

function chain(i,j){
	if(i > 0 && j > 0 && isCellVallue(i-1,j-1,"")){clickCell(i-1,j-1);}
	if(i > 0 && isCellVallue(i-1,j,"")){clickCell(i-1,j);}
	if(i > 0 && j < columns-1 && isCellVallue(i-1,j+1,"")){clickCell(i-1,j+1);}
	
	if(j > 0 && isCellVallue(i,j-1,"")){clickCell(i,j-1);}
	if(j < columns-1 && isCellVallue(i,j+1,"")){clickCell(i,j+1);}
	
	if(i < rows-1 && j > 0 && isCellVallue(i+1,j-1,"")){clickCell(i+1,j-1);}
	if(i < rows-1 && isCellVallue(i+1,j,"")){clickCell(i+1,j);}
	if(i < rows-1 && j < columns-1 && isCellVallue(i+1,j+1,"")){clickCell(i+1,j+1);}
}

function rightClickCell(i,j){
	if(countMoves != 0)
	if(isCellVallue(i,j,"")){
		setCell(i,j,"p");
	}else if(isCellVallue(i,j,"p")){
		setCell(i,j,"");
	}
}

function isCellVallue(i,j,vallue){
	return document.getElementById("cell"+i+j).innerHTML == vallue;
}

function setCell(i,j,vallue){
	document.getElementById("cell"+i+j).innerHTML = vallue;
}

function endGame(flag){
	for(i = 0; i < rows; i++){
		for(j = 0; j < columns; j++){
			if(field[i][j] == -1){
				setCell(i,j,"*");
			}
		}
	}
	countMoves = 0;
	alert(flag?"You win":"You lose");
}