
                                    //  #This Javascripts is written by Github Copilot#

// --- DOM Elements ---
const statusDisplay = document.querySelector('#statusDisplay');
const gameBoard = document.querySelector('#gameBoard');
const cells = document.querySelectorAll('.cell');
const restartButton = document.querySelector('#restartButton');

// --- Game Variables ---
let gameActive = true;
let currentPlayer = 'X';
// Represents the board state: '' empty, 'X' or 'O' filled
let gameState = ["", "", "", "", "", "", "", "", ""];

// --- Messages ---
const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `Player ${currentPlayer}'s turn`;

// --- Winning Conditions ---
// Indexes of the board that form a winning line
const winningConditions = [
    [0, 1, 2], // Row 1
    [3, 4, 5], // Row 2
    [6, 7, 8], // Row 3
    [0, 3, 6], // Column 1
    [1, 4, 7], // Column 2
    [2, 5, 8], // Column 3
    [0, 4, 8], // Diagonal 1
    [2, 4, 6]  // Diagonal 2
];

// --- Functions ---

// Update the UI for a cell that has been played
function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer; // Update internal state
    clickedCell.innerHTML = currentPlayer;       // Update visually on page
    // Add class for styling X or O
    clickedCell.classList.add(currentPlayer.toLowerCase());
}

// Change the current player and update the status display
function handlePlayerChange() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.innerHTML = currentPlayerTurn();
}

// Check if the game has been won or is a draw
function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        // Get the state of the three cells in the current win condition
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];

        // If any cell in the condition is empty, this condition isn't met
        if (a === '' || b === '' || c === '') {
            continue; // Check the next condition
        }
        // If all three cells are the same, we have a winner
        if (a === b && b === c) {
            roundWon = true;
            break; // Exit the loop, winner found
        }
    }

    // --- Process Win ---
    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        return; // Stop the function here
    }

    // --- Process Draw ---
    // Check if gameState includes any empty strings. If not, all cells are filled.
    let roundDraw = !gameState.includes("");
    if (roundDraw && !roundWon) { // Ensure it's a draw and not a win that filled the board
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return; // Stop the function here
    }

    // --- Continue Game ---
    // If we get here, no one has won and it's not a draw, so switch player
    handlePlayerChange();
}

// Handle a click on a cell
function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    // Get the 'data-cell-index' attribute value and convert it to a number
    const clickedCellIndex = parseInt(
        clickedCell.getAttribute('data-cell-index')
    );

    // --- Validations ---
    // 1. Is the cell already played?
    // 2. Is the game currently inactive (already won or draw)?
    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return; // Do nothing if the cell is filled or game is over
    }

    // --- Process Move ---
    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

// Reset the game to its initial state
function handleRestartGame() {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    // Clear visual representation and remove X/O classes
    cells.forEach(cell => {
        cell.innerHTML = "";
        cell.classList.remove('x', 'o');
    });
}

// --- Event Listeners ---
// Add click listener to each cell
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
// Add click listener to the restart button
restartButton.addEventListener('click', handleRestartGame);

// --- Initial Setup ---
// Display the initial turn message when the page loads
statusDisplay.innerHTML = currentPlayerTurn();