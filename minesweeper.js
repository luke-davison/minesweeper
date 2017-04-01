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
  document.addEventListener('click', checkForWin);
  document.addEventListener('contextmenu', checkForWin);
  document.getElementsByClassName("resetbutton")[0].addEventListener('click',resetBoard);
}

// Define this function to look for a win condition:
//
// 1. Are all of the cells that are NOT mines visible?
// 2. Are all of the mines marked?
function checkForWin () {
  for (var i = 0; i < board.cells.length; i++) {
    if (board.cells[i].isMarked) {
      return;
    }
  }
  // You can use this function call to declare a winner (once you've
  // detected that they've won, that is!)
  lib.displayMessage('You win!')
}
function resetBoard() {
  while (document.getElementsByClassName("board")[0].hasChildNodes()) {
    console.log()
    document.getElementsByClassName("board")[0].removeChild(document.getElementsByClassName("board")[0].lastChild)
  }
  getVariables();
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
  if (hint[1]) {
    getNodeByCoordinates(hint[0].row,hint[0].col).classList.add("minehint");
  }
  else {
    getNodeByCoordinates(hint[0].row,hint[0].col).classList.add("emptyhint");
  }
}

function findMove() {
  var cellsFound = [];
  var nearbyes = [];
  for (var i = 0; i < board.cells.length; i ++) {
    if ((board.cells[i].hidden === false)&&(board.cells[i].surroundingMines > 0)) {
      cellsFound[cellsFound.length] = i;
      nearbyes[nearbyes.length] = lib.getSurroundingCells(board.cells[i].row,board.cells[i].col);
      for (var j = 0; j < nearbyes[nearbyes.length-1].length; j ++) {
        if ((nearbyes[nearbyes.length-1][j].hidden===false)||(nearbyes[nearbyes.length-1][j].isMarked===false)) {
          nearbyes[nearbyes.length-1].splice(j,1);
          j--;
        }
      }
      if (board.cells[i].surroundingMines === nearbyes[nearbyes.length-1].length) {
        return [nearbyes[nearbyes.length-1][0],true];
      }
    }
  }
}
