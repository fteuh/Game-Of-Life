// Get the necessary elements from the DOM
const gameGrid = document.getElementById('game-grid');
const rowsInput = document.getElementById('rows');
const columnsInput = document.getElementById('columns');
const speedInput = document.getElementById('speed');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const resetButton = document.getElementById('reset-button');

// Initialize game variables
let rows = parseInt(rowsInput.value);
let columns = parseInt(columnsInput.value);
let speed = parseInt(speedInput.value);
let grid = [];
let gridState = [];
let timer;

// Function to generate the game grid
function generateGrid() {
    let html = '';
    for (let i = 0; i < rows; i++) {
        html += '<tr>';
        for (let j = 0; j < columns; j++) {
            html += '<td class="" onclick="changeState(this)"><div class="inside"></div></td>';
        }
        html += '</tr>';
    }
    gameGrid.innerHTML = html;
    grid = Array.from(gameGrid.getElementsByTagName('td'));
    adjustCellHeight();
}

function changeState(elem) {
    if (elem.className == 'alive') {
        elem.className = '';
    } else {
        elem.className = 'alive'
    }
}

// Function to update the game grid based on the current state
function updateGrid() {
    grid.forEach((cell, index) => {
        cell.className = gridState[index] ? 'alive' : '';
    });
}

function nextStep() {
    let elem;
    let neigh;
    gridState = [];
    for (let i = 0; i < grid.length; i++) {
        elem = grid[i];
        neigh = getAliveNeighbours(i);
        if(neigh > 3 || neigh < 2) {
            gridState.push(false);
        } else if (grid[i].className == 'alive' || neigh == 3) {
            gridState.push(true);
        } else {
            gridState.push(false);
        }
    }

    updateGrid();
}

function getAliveNeighbours(index) {
    var total = 0;

    // Left
    if (index != 0 && 
        grid[index-1].className == 'alive') {
        total += 1;
    }

    // Rignt
    if (index != rows * columns - 1 && 
        grid[index+1].className == 'alive') {
        total += 1;
    }

    // Top
    if (index >= columns && 
        grid[index-columns].className == 'alive') {
        total += 1;
    }

    // Bottom
    if (index <= rows * columns - columns - 1 && 
        grid[index+columns].className == 'alive') {
        total += 1;
    }

    // Top Left
    if (index >= columns + 1 && 
        grid[index-columns-1].className == 'alive') {
        total += 1;
    }

    // Top Right
    if (index >= columns && 
        (index+1) % columns != 0 &&
        grid[index-columns+1].className == 'alive') {
        total += 1;
    }

    // Bottom Right
    if (index <= rows * columns - columns - 2 && 
        grid[index+columns+1].className == 'alive') {
        total += 1;
    }

    // Bottom Left
    if (index <= rows * columns - columns && 
        index % columns != 0 &&
        grid[index+columns-1].className == 'alive') {
        total += 1;
    }

    return total;
}

// Function to start the game
function startGame() {
    timer = setInterval(nextStep, 1000 / speed);
    startButton.disabled = true;
    speedInput.disabled = true;
    columnsInput.disabled = true;
    rowsInput.disabled = true;
    stopButton.disabled = false;
}

// Function to stop the game
function stopGame() {
    clearInterval(timer);
    startButton.disabled = false;
    speedInput.disabled = false;
    columnsInput.disabled = false;
    rowsInput.disabled = false;
    stopButton.disabled = true;
}

function overTD(elem) {
    if (isMouseDown) {
        changeState(elem);
    }
}

function resetGame() {
    stopGame();
    generateGrid();
}

stopButton.disabled = true;

// Event listener for start button click
startButton.addEventListener('click', startGame);

// Event listener for stop button click
stopButton.addEventListener('click', stopGame);

rowsInput.addEventListener('change', () => {
    rows = parseInt(rowsInput.value);
    generateGrid();
});

columnsInput.addEventListener('change', () => {
    columns = parseInt(columnsInput.value);
    generateGrid();
});

speedInput.addEventListener('change', () => {
    speed = parseInt(speedInput.value);
})

resetButton.addEventListener('click', resetGame);

let isMouseDown = false; // Flag to track if the mouse is pressed

document.addEventListener('mousedown', function(event) {
  // Check if the left mouse button was pressed
  if (event.button === 0) { // 0 is the code for the left mouse button
    isMouseDown = true; // Set the flag to true when mouse is down
  }
});

document.addEventListener('mouseup', function(event) {
  // Reset the flag when the mouse button is released
  isMouseDown = false;
});



document.addEventListener('mouseout', function(event) {
  // Check if the mouse is over a td element and the left mouse button is pressed
  if (event.target.tagName === 'TD' && isMouseDown) {
    event.target.className = 'alive';
  }
});

function adjustCellHeight() {
    const columnWidth = `calc(100vw / ${columns})`;
    const width = 100 / columns * window.innerWidth;
    const rowHeight = `calc(88vh / ${rows})`;
    const height = 88 / rows * window.innerHeight;

    if (height > width) {
        grid.forEach(cell => {
            cell.style.width = columnWidth;
        });
    } else {
        grid.forEach(cell => {
            cell.style.height = rowHeight;
        });
    }
    
} 

// Generate the initial game grid
generateGrid();