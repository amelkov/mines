var numberMines = 10;
var fieldValues = []; //неудобно проверять соседние клетки, переделать под массив
fieldValues.length = 64; 

var container = document.createElement("div");
container.className = 'container';
container.id = 'container';
document.body.appendChild(container);

var field = document.createElement("div");
field.className = 'field';
field.id = 'field';
container.appendChild(field);

for(i=1;i<=fieldValues.length;i++){
	(function (i) {
		var cell = document.createElement("div");
		cell.className = 'cell';
		cell.id = 'cell'+i;
		field.appendChild(cell);
		cell.addEventListener('click', function(){clickCell(i)});
	}(i));
}

//x(-1) - мина или число
function createField(){
	for(i = 0; i < numberMines; i++){
		var j = randomCell();
		if(fieldValues[j] == null){
			fieldValues[j] = -1;
		}else {i--;}
	}
	
	for(i = 0; i<fieldValues.length; i++){
		if(fieldValues[i] != -1){
			
		}
	}
}
//тоже переделать под матрицу
function randomCell(){
	return Math.floor(Math.random() * 64);
}
/*
нужно будет переделать под матрицу

пример создания
function matrixArray(rows,columns){
  var arr = new Array();
  for(var i=0; i<columns; i++){
    arr[i] = new Array();
    for(var j=0; j<rows; j++){
      arr[i][j] = i+j+1;
    }
  }
  return arr;
}
var myMatrix = matrixArray(3,3);
*/
function countMines(cell){
	var count = 0;
	if(cell % 8 && fieldValues[cell-9] == -1){count++;}
	if(cell > 7 && fieldValues[cell-8] == -1){count++;}
	if(cell > 6 && fieldValues[cell-7] == -1){count++;}
	if(cell > 0 && fieldValues[cell-1] == -1){count++;}
	if(cell > 8 && fieldValues[cell-8] == -1){count++;}
	
}