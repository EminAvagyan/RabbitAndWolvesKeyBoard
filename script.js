const EMPTY_CELL = 0;
const WOLF = 1;
const FENCE = 2;
const HOUSE = 3;
const RABBIT = 4;
const X = 0
const Y = 1 

const gallery = new Array();

gallery[1] = "images/gamewolf.png";
gallery[2] = "images/ban.png";
gallery[3] = "images/home.png";
gallery[4] = "images/rabbit.png";

function gameStart() {
  const gameAreaSize = parseInt(document.getElementById("select").value);
  const matrix = createGameArray(gameAreaSize);
  console.log(matrix)
  setGameAreWidth(gameAreaSize);

  insertAllCharacters(matrix, gameAreaSize);
  hideGameMessages();
  clearGameArea()
  
  createGameArea(matrix, gameAreaSize);
  
  eventListenersForRabbit(matrix, gameAreaSize);
}

function setGameAreWidth(gameAreaSize) {
  const width = gameAreaSize * 60 + 20 + "px";
  const gameAreaDiv = document.getElementById("game_area");
  gameAreaDiv.style.width = width;
}
function eventListenersForRabbit(array, gameAreaSize) {
  window.onkeydown = (event) => {
    const eventKey = event.key
    eventKeysFunctions(eventKey, array)
  
    changeWolvesPositions(array);
    clearGameArea();
    createGameArea(array, gameAreaSize);
  };
}

function eventKeysFunctions(event, array) {
  var eventDirection = {
    "ArrowUp": function(){
      moveRabbitUp(array)
    },
    "ArrowDown": function(){
      moveRabbitDown(array)
    },
    "ArrowLeft": function(){
      moveRabbitLeft(array)
    },
    "ArrowRight": function(){
      moveRabbitRight(array)
    },
  };
  console.log(array)
  return eventDirection[event]();
}

function changeWolvesPositions(array) {
  const wolvesCords = findCharacterCords(array, WOLF);

  wolvesCords.forEach((singleWolf) => {
    changeSingleWolfPosition(array, singleWolf)
  });
}

function changeSingleWolfPosition(array, singleWolf){
  const rabbitCords = findCharacterCords(array, RABBIT);
  
  const cellsArround = findEmptyCellsArroundWolf(array, singleWolf);
    
    const freeCells = checkCells(cellsArround, array)

    if (freeCells != undefined) {
      const distanceArray = calculateDistanceOfCells( freeCells, rabbitCords);
      const closestCell = getClosestCell(distanceArray, freeCells)
      getClosestCell(distanceArray, freeCells)
      placeWolvesIntoNewCells(array, closestCell, singleWolf)
    }
}

function checkCells(cellsArround, array){
  const newArray = []
  cellsArround.forEach((cell) => {
    const [x,y] = cell 
    if( array[x][y] === RABBIT){
    showGameMessages("over")
  } if(array[x][y] === EMPTY_CELL){
    newArray.push(cell)
    // console.log(cell)
  }})
  return newArray
}


function checkEmptyCells([x, y], array){
    return x >= 0 && x < array.length && y >= 0 && y < array.length
}

function findEmptyCellsArroundWolf(array, [x, y]) {
  let movementDirections = [
    [x, y],
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ];
  const emptyCells = movementDirections.filter((cell) => checkEmptyCells(cell, array))
  return emptyCells
}


function calculateDistanceOfCells(freeVellsArray,rabbitCords) {
  const distanceArray = [];
  freeVellsArray.forEach((item) => {
    const distance = calculateDistanceFromRabbit(item, rabbitCords);
    distanceArray.push(distance);
  });
  return distanceArray

}
function getClosestCell(distanceArray, freeVellsArray){
  const max = Math.min(...distanceArray);
  const index = distanceArray.indexOf(max);
  return freeVellsArray[index]
}


const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function placeWolvesIntoNewCells(array, wolvesCords, item) {
  if(wolvesCords != undefined){
    const rabbitCords = findCharacterCords(array, RABBIT);
    const [x, y] = wolvesCords;
    const [k, p] = item;
    if (equals([x, y], rabbitCords)) {
      showGameMessages("over")
    } else {
      array[x][y] = WOLF;
      array[k][p] = EMPTY_CELL;
    }
  }
  
}

function calculateDistanceFromRabbit([x1, y1], [[x2, y2]]) {

  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function moveRabbitUp(array) {
  const rabbitCords = findCharacterCords(array, RABBIT);
  const directions = getEventDirection(rabbitCords);
  if (rabbitCords[X][X] === 0) {
    directions.up[X] = array.length - 1;
  }
  checkDir(directions.up, rabbitCords, array);
}

function moveRabbitDown(array) {
  const rabbitCords = findCharacterCords(array, RABBIT);
  const directions = getEventDirection(rabbitCords);
  if (rabbitCords[X][X] === array.length - 1) {
    directions.down[X] = 0;
  }
  checkDir(directions.down, rabbitCords, array);
}

function moveRabbitLeft(array) {
  const rabbitCords = findCharacterCords(array, RABBIT);
  const directions = getEventDirection(rabbitCords);
  if (rabbitCords[X][Y] === 0) {
    directions.left[Y] = array.length - 1;
  }
  checkDir(directions.left, rabbitCords, array);
}
function moveRabbitRight(array) {
  const rabbitCords = findCharacterCords(array, RABBIT);
  const directions = getEventDirection(rabbitCords);
  if (rabbitCords[X][Y] === array.length - 1) {
    directions.right[Y] = 0;
  }
  checkDir(directions.right, rabbitCords, array);
}

function checkDir(newCords, napCords, array) {
  const [j, k] = newCords;
  const [x, y] = napCords[X];
  if (array[j][k] == EMPTY_CELL) {
    array[j][k] = RABBIT;
    array[x][y] = EMPTY_CELL;
  } else if (array[j][k] === HOUSE) {
    array[x][y] = EMPTY_CELL;
    showGameMessages("win")
  } else if (array[j][k] === FENCE) {
    return;
  }
  if (array[j][k] === WOLF) {
    showGameMessages("over")
  }
}

function getEventDirection(rabbitCords) {
  let [x, y] = rabbitCords[X];
  const direction = {
    up: [x - 1, y],
    down: [x + 1, y],
    right: [x, y + 1],
    left: [x, y - 1],
  };

  return direction;
}

function findCharacterCords(array, character) {
  const findInMatrix = function (accumulator, row, x) {
    row.forEach((element, y) => {
      if (element === character) {
        accumulator.push([x, y]);
      }
    });

    return accumulator;
  };

  return array.reduce(findInMatrix, []);
}

function insertAllCharacters(array, gameAreaSize) {
  const wolvesCount = (gameAreaSize / 100) * 60;
  const fenceCount = (gameAreaSize / 100) * 40;
  insertCharactersIntoArray(array, WOLF, wolvesCount);
  insertCharactersIntoArray(array, FENCE, fenceCount);
  insertCharactersIntoArray(array, HOUSE, 1);
  insertCharactersIntoArray(array, RABBIT, 1);
}

function createGameArray(gameAreaSize) {
  const gameCondition = new Array(gameAreaSize)
    .fill(EMPTY_CELL)
    .map(() => new Array(gameAreaSize).fill(EMPTY_CELL));

  return gameCondition;
}

function insertSingleCharacter(cord, myArray, character) {
  const x = cord[X];
  const y = cord[Y];
  myArray[x][y] = character;
}

function findEmptyCell(myArray) {
  const randomX = Math.floor(Math.random() * myArray.length);
  const randomY = Math.floor(Math.random() * myArray.length);
  if (myArray[randomX][randomY] === EMPTY_CELL) {
    return [randomX, randomY];
  } else {
    return findEmptyCell(myArray);
  }
}

function insertCharactersIntoArray(myArray, character, count) {
  for (let i = 0; i < count; i++) {
    const cords = findEmptyCell(myArray);
    insertSingleCharacter(cords, myArray, character);
  }
  return myArray;
}

function clearGameArea() {
  const containerNode = document.getElementById("game_area");
  containerNode.innerHTML = "";
}

function createInnerDivs(cellIndex) {
  const containerNode = document.getElementById("game_area");

  const div = document.createElement("div");
  div.setAttribute("id", cellIndex);
  containerNode.append(div);
}
function insertCharacterImage(character, cellIndex) {
  const div = document.getElementById(cellIndex);
  const img = document.createElement("img");
  img.src = gallery[character];
  img.style.width = "60px";
  div.append(img);
}

function createGameArea(array, gameAreaSize) {
  array.forEach((row, i) => {
    row.forEach((column, j) => {
      const cellIndex = i.toString() + j.toString();
      if (column === EMPTY_CELL) {
        createInnerDivs(cellIndex);
      }
      if (column === RABBIT) {
        createInnerDivs(cellIndex);
        insertCharacterImage(RABBIT, cellIndex);
      }
      if (column === WOLF) {
        createInnerDivs(cellIndex);
        insertCharacterImage(WOLF, cellIndex);
      }
      if (column === FENCE) {
        createInnerDivs(cellIndex);
        insertCharacterImage(FENCE, cellIndex);
      }
      if (column === HOUSE) {
        createInnerDivs(cellIndex);
        insertCharacterImage(HOUSE, cellIndex);
      }
    });
  });
}
function hideGameMessages(){
  const mainDiv = document.getElementById("message_div")
  mainDiv.style.display = "none"
  const gameBoard = document.getElementById("wrapper")
  gameBoard.style.display = "block"
}
function showGameMessages(gameStatus){
  
  const mainDiv = document.getElementById("message_div")
  const message = document.querySelector("#message_div>h2")
  const gameBoard = document.getElementById("wrapper")
  gameBoard.style.display = "none"
  if(gameStatus === "over"){
    message.innerText = "Game over"
  } else if(gameStatus === "win"){
    message.innerText = "You win"
  }
  
  mainDiv.style.display = "block"
  // window.removeEventListener("keydown", listener)
}