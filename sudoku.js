//Load boards manually
const easy = [
  "142-9---57--4---898-5----242----48---3---126--8--72941-5-2-6----28--941--791-853-",
  "142893675763425189895617324217964853934581267586372941451236798328759416679148532",
];
const medium = [
  "---93------4--2-98-59--4-----72-8---5--6--9----8-5-67-2915--83--6-------485-29-67",
  "826935741374162598159784326637298415542617983918453672291576834763841259485329167",
];
const hard = [
  "4-6----59----4-2---7---------591--6--13---894---2----15-8----------3---8-4--6-1--",
  "436128759951746283872359416785914362213675894694283571528491637167532948349867125",
];

let selectedNumber;
let selectedTile;
let disableSelect;
let timer;
let timeRemaining;
let lives;

window.onload = function () {
  // Add event listener to the theme radio buttons
  const themeRadios = document.querySelectorAll('input[name="theme"]');
  themeRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      // Handle theme change immediately
      if (this.value === "Light") {
        document.body.classList.remove("dark");
      } else {
        document.body.classList.add("dark");
      }
    });
  });
  //Starts new game when button is clicked
  id("start-button").addEventListener("click", startGame);
  //Add event listener to the number container
  for (let i = 0; i < id("number-container").children.length; i++) {
    id("number-container").children[i].addEventListener("click", function () {
      //If number is not disabled
      if (!disableSelect) {
        //If number is already selected
        if (this.classList.contains("selected")) {
          //then remove selection
          this.classList.remove("selected");
          selectedNumber = null;
        } else {
          //Deselect all other numbers
          for (let i = 0; i < 9; i++) {
            id("number-container").children[i].classList.remove("selected");
          }
          //Select it and update selected number variable
          this.classList.add("selected");
          selectedNumber = this;
          updateMove();
        }
      }
    });
  }
};

function startGame() {
  let board;
  if (id("diff-1").checked) board = easy[0];
  else if (id("diff-2").checked) board = medium[0];
  else board = hard[0];
  //Set lives to 3 and eneble selecting numbers and tiles
  lives = 5;
  disableSelect = false;
  id("lives").textContent = "Lives remaining: 5";
  //Creates board based on difficulty
  generateBoard(board);
  //Starts Timer
  startTimer();
}

function startTimer() {
  //Sets time remaining based on input
  if (id("time-1").checked) timeRemaining = 300;
  else if (id("time-2").checked) timeRemaining = 600;
  else timeRemaining = 900;
  //Sets timer for first second
  id("timer").textContent = timeConversion(timeRemaining);
  //Sets timer to update every second
  timer = setInterval(function () {
    timeRemaining--;
    //If no time remaining end the game
    if (timeRemaining === 0) endGame();
    id("timer").textContent = timeConversion(timeRemaining);
  }, 1000);
}
//Converts seconds into string of MM:SS format
function timeConversion(time) {
  let minutes = Math.floor(time / 60);
  if (minutes < 10) minutes = "0" + minutes;
  let seconds = time % 60;
  if (seconds < 10) seconds = "0" + seconds;
  return minutes + ":" + seconds;
}

function generateBoard(board) {
  //Clear previous boards
  clearPrevious();
  //Let used to increment tile ids
  let idCount = 0;
  //Create 81 tiles
  for (let i = 0; i < 81; i++) {
    //Create a new paragraph element
    let tile = document.createElement("p");
    //If tile is not blank
    if (board.charAt(i) != "-") {
      //Set tile text to correct number
      tile.textContent = board.charAt(i);
    } else {
      //Add click event listener to tile
      tile.addEventListener("click", function () {
        //If selecting is not disabled
        if (!disableSelect) {
          //If the tile is already selected
          if (tile.classList.contains("selected")) {
            //Remove selected
            tile.classList.remove("selected");
            selectedTile = null;
          } else {
            //Deselect all other tiles
            for (let i = 0; i < 81; i++) {
              qsa(".tile")[i].classList.remove("selected");
            }
            //Add selection and update variable
            tile.classList.add("selected");
            selectedTile = tile;
            updateMove();
          }
        }
      });
    }
    //Assign tile id
    tile.id = idCount;
    //Increment for next tile
    idCount++;
    //Add tile class to all tiles
    tile.classList.add("tile");
    if ((tile.id > 17 && tile.id < 27) || (tile.id > 44) & (tile.id < 54)) {
      tile.classList.add("bottomBorder");
    }
    //Add tile to board
    id("board").appendChild(tile);
  }
}

function updateMove() {
  //If a tile and number is selected
  if (selectedTile && selectedNumber) {
    //Set the tile to correct number
    selectedTile.textContent = selectedNumber.textContent;
    //If number matches the corresponding number in solution key
    if (checkCorrect(selectedTile)) {
      //Deselect the tiles
      selectedTile.classList.remove("selected");
      selectedNumber.classList.remove("selected");
      //Clear the selected variables
      selectedNumber = null;
      selectedTile = null;
      //If all tiles are correct end the game
      if (checkDone()) {
        endGame();
      }
      //If number does not match solution key
    } else {
      //Disable selecting the numbers for one second
      disableSelect = true;
      //Make tile turn red
      selectedTile.classList.add("incorrect");
      //Run in one second
      setTimeout(function () {
        //subtract lives by one
        lives--;
        //No lives left in the game
        if (lives === 0) {
          endGame();
        } else {
          //If lives is not equal to zero, update lives text
          id("lives").textContent = "Lives remaining: " + lives;
          //Renable selecting numbers and tiles
          disableSelect = false;
        }
        //Restore tile color and remove selected from both
        selectedTile.classList.remove("incorrect");
        selectedTile.classList.remove("selected");
        selectedNumber.classList.remove("selected");
        //Clear the tiles text and clear selected variables
        selectedTile.textContent = "";
        selectedTile = null;
        selectedNumber = null;
      }, 1000);
    }
  }
}

function checkDone() {
  let tiles = qsa(".tile");
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].textContent === "") return false;
  }
  return true;
}

function endGame() {
  //Disable moves and stop the timer
  disableSelect = true;
  clearTimeout(timer);
  //Display win or loss message
  if (lives === 0 || timeRemaining === 0) {
    id("lives").textContent = "You lost the Game, loser!";
  } else {
    id("lives").textContent = "You're brilliant, you won!";
  }
}

function checkCorrect(tile) {
  //Set solution based on difficulty solution
  let solution;
  if (id("diff-1").checked) solution = easy[1];
  else if (id("diff-2").checked) solution = medium[1];
  else solution = hard[1];
  //If tile number is equal to selection number
  if (solution.charAt(tile.id) === tile.textContent) return true;
  else return false;
}

function clearPrevious() {
  let tiles = qsa(".tile");
  //Remove each tile
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].remove();
  }
  //Clear Timer
  if (timer) clearTimeout(timer);
  //Clear selected variables
  selectedTile = null;
  selectedNumber = null;
}

//Helper functions
function id(id) {
  return document.getElementById(id);
}

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return document.querySelectorAll(selector);
}
