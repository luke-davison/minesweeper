document.addEventListener('DOMContentLoaded', startGame)

// Define your `board` object here!
var board = {
  cells: []
}
var boardWidth = 8;
var boardHeight = 8;
var numMines = 10;
var mineCount = 10;
var boardSize = "small"
var firstMove = true;

function setUpBoard() {
  board.cells = [];
  for (i = 0;i < boardHeight;i++) {
    for (j = 0; j < boardWidth;j++) {
      board.cells[i*boardWidth+j] = {
        row: i,
        col: j,
        isMine: false,
        hidden: true,
        isMarked: true,
        surroundingMines: 0,
        isProcessed: false
      }
    }
  }
}

function addMines(move) {

  var rSpot;
  var nearbySpots;
  for (var i = 0; i < numMines; i++) {
    rSpot = Math.floor(Math.random()*boardWidth*boardHeight);
    if ((board.cells[rSpot].isMine) || (rSpot === move)) {
      i --;
    }
    else {
      board.cells[rSpot].isMine = true;
      getNodeByCoordinates(board.cells[rSpot].row,board.cells[rSpot].col).classList.add("mine");
      nearbySpots = lib.getSurroundingCells(board.cells[rSpot].row,board.cells[rSpot].col)
      for (var j = 0; j < nearbySpots.length;j++) {
        nearbySpots[j].surroundingMines ++;
      }
    }
  }
}

function startGame () {
  // Don't remove this function call: it makes the game work!
  setUpBoard();
  lib.initBoard()
  document.getElementById("minesLeft").innerHTML= "<p>" +numMines + " mines remaining </p>"
  document.getElementsByClassName("resetbutton")[0].addEventListener('click',resetBoard);
  document.getElementsByClassName("hintbutton")[0].addEventListener('click',showHint);
}

// Define this function to look for a win condition:
//
// 1. Are all of the cells that are NOT mines visible?
// 2. Are all of the mines marked?
function checkForWin () {
  if (mineCount === 0) {
    for (var i = 0; i < board.cells.length; i++) {
      if ((board.cells[i].isMarked)&&(board.cells[i].hidden)) {
        return;
      }
    }
    // You can use this function call to declare a winner (once you've
    // detected that they've won, that is!)
    lib.displayMessage('You win!')
  }
}
function resetBoard() {
  while (document.getElementsByClassName("board")[0].hasChildNodes()) {
    document.getElementsByClassName("board")[0].removeChild(document.getElementsByClassName("board")[0].lastChild)
  }
  getVariables();
  firstMove = true;
  startGame();

}
function getVariables() {
  if ((document.getElementById("smallSize").checked) && (document.getElementById("easyDifficulty").checked)) {
    boardWidth = 8;
    boardHeight = 8;
    numMines = 8;
    boardSize = "small";
  }
  if ((document.getElementById("smallSize").checked) && (document.getElementById("mediumDifficulty").checked)) {
    boardWidth = 8;
    boardHeight = 8;
    numMines = 10;
    boardSize = "small";
  }
  if ((document.getElementById("smallSize").checked) && (document.getElementById("hardDifficulty").checked)) {
    boardWidth = 8;
    boardHeight = 8;
    numMines = 13;
    boardSize = "small";
  }
  if ((document.getElementById("mediumSize").checked) && (document.getElementById("easyDifficulty").checked)) {
    boardWidth = 16;
    boardHeight = 16;
    numMines = 32;
    boardSize = "medium";
  }
  if ((document.getElementById("mediumSize").checked) && (document.getElementById("mediumDifficulty").checked)) {
    boardWidth = 16;
    boardHeight = 16;
    numMines = 40;
    boardSize = "medium";
  }
  if ((document.getElementById("mediumSize").checked) && (document.getElementById("hardDifficulty").checked)) {
    boardWidth = 16;
    boardHeight = 16;
    numMines = 50;
    boardSize = "medium";
  }
  if ((document.getElementById("largeSize").checked) && (document.getElementById("easyDifficulty").checked)) {
    boardWidth = 22;
    boardHeight = 22;
    numMines = 64;
    boardSize = "large";
  }
  if ((document.getElementById("largeSize").checked) && (document.getElementById("mediumDifficulty").checked)) {
    boardWidth = 22;
    boardHeight = 22;
    numMines = 80;
    boardSize = "large";
  }
  if ((document.getElementById("largeSize").checked) && (document.getElementById("hardDifficulty").checked)) {
    boardWidth = 22;
    boardHeight = 22;
    numMines = 100;
    boardSize = "large";
  }
  mineCount = numMines;
}

function showHint() {
  var hint = findMove();
  if (hint === undefined) {
    alert("I cannot see any moves for you.  You'll need to guess.");
  }
  else if (hint[1]) {
    getNodeByCoordinates(hint[0].row,hint[0].col).classList.add("minehint");
  }
  else {
    getNodeByCoordinates(hint[0].row,hint[0].col).classList.add("emptyhint");
  }
}

function findMove() {
  var cellsFound = [];
  var nearbyes = [];
  var minesNearby = [];
  for (var i = 0; i < board.cells.length; i ++) {
    if ((board.cells[i].hidden === false)&&(board.cells[i].surroundingMines > 0)) {
      cellsFound[cellsFound.length] = i;
      nearbyes[nearbyes.length] = lib.getSurroundingCells(board.cells[i].row,board.cells[i].col);
      minesNearby[minesNearby.length] = board.cells[i].surroundingMines;
      for (var j = 0; j < nearbyes[nearbyes.length-1].length; j ++) {
        if ((nearbyes[nearbyes.length-1][j].hidden===false)||(nearbyes[nearbyes.length-1][j].isMarked===false)) {
          if ((nearbyes[nearbyes.length-1][j].hidden===true)&&(nearbyes[nearbyes.length-1][j].isMarked===false)) {
            minesNearby[minesNearby.length-1] --;
          }
          nearbyes[nearbyes.length-1].splice(j,1);
          j--;
        }
      }
      if (nearbyes[nearbyes.length-1].length > 0) {
        if (minesNearby[minesNearby.length-1] === nearbyes[nearbyes.length-1].length) {
          return [nearbyes[nearbyes.length-1][0],true];
        }
        if (minesNearby[minesNearby.length-1] === 0) {
          return [nearbyes[nearbyes.length-1][0],false];
        }
      }
      else {
        cellsFound.splice(cellsFound.length-1,1);
        nearbyes.splice(nearbyes.length-1,1);
        minesNearby.splice(minesNearby.length-1,1);
        //i --;
      }
    }
  }
  for (var i = 0; i < cellsFound.length; i++) {
    for (var j = 0; j < cellsFound.length; j++) {
      if (i != j) {
        if (containsAll(nearbyes[i],nearbyes[j])) {
          for (var k = 0; k < nearbyes[i].length; k ++) {
            nearbyes[j].splice(nearbyes[j].indexOf(nearbyes[i][k]),1);
          }
          minesNearby[j] -= minesNearby[i];
          if (nearbyes[j].length === 0) {
            cellsFound.splice(j,1);
            nearbyes.splice(j,1);
            minesNearby.splice(j,1);
            j --;
          }
        }
      }
    }
  }
  for (var i = 0; i < cellsFound.length; i++) {
    if (minesNearby[i] === nearbyes[i].length) {
      return [nearbyes[i][0],true];
    }
    if (minesNearby[i] === 0) {
      return [nearbyes[i][0],false];
    }
  }
}


//this function returns true if the contents of array1 are all present in array2
function containsAll(array1,array2) {
  var found;
  for (var i = 0; i < array1.length; i ++) {
    found = false;
    for (var j = 0; j < array2.length; j ++) {
      if (array1[i] === array2[j]) {
        found = true;
      }
    }
    if (found===false) {
      return false;
    }
  }
  return true;
}
