// Tic Tac Toe Game Logic

class TicTacToe {
  constructor() {
    this.board = Array(9).fill('');
    this.currentPlayer = 'X';
    this.gameActive = true;
    this.winningConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
  }

  makeMove(index) {
    if (this.board[index] === '' && this.gameActive) {
      this.board[index] = this.currentPlayer;
      this.checkWinner();
      this.switchPlayer();
      return true;
    }
    return false;
  }

  checkWinner() {
    let roundWon = false;
    for (let i = 0; i < this.winningConditions.length; i++) {
      const winCondition = this.winningConditions[i];
      let a = this.board[winCondition[0]];
      let b = this.board[winCondition[1]];
      let c = this.board[winCondition[2]];
      if (a === '' || b === '' || c === '') {
        continue;
      }
      if (a === b && b === c) {
        roundWon = true;
        break;
      }
    }

    if (roundWon) {
      this.gameActive = false;
      return `Player ${this.currentPlayer} wins!`;
    }

    let roundDraw = !this.board.includes('');
    if (roundDraw) {
      this.gameActive = false;
      return 'Game is a draw!';
    }

    return null;
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
  }

  resetGame() {
    this.board = Array(9).fill('');
    this.currentPlayer = 'X';
    this.gameActive = true;
  }

  getBoard() {
    return this.board;
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }

  isGameActive() {
    return this.gameActive;
  }
}

// Initialize the game
const game = new TicTacToe();

// DOM manipulation functions
function initializeGame() {
  const cells = document.querySelectorAll('.cell');
  const statusDisplay = document.getElementById('status');
  const restartButton = document.getElementById('restart');

  cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(index));
  });

  if (restartButton) {
    restartButton.addEventListener('click', handleRestartGame);
  }

  updateDisplay();
}

function handleCellClick(index) {
  if (game.makeMove(index)) {
    updateDisplay();
    const result = game.checkWinner();
    if (result) {
      updateStatus(result);
    }
  }
}

function updateDisplay() {
  const cells = document.querySelectorAll('.cell');
  const board = game.getBoard();
  
  cells.forEach((cell, index) => {
    cell.textContent = board[index];
    cell.classList.remove('x', 'o');
    if (board[index]) {
      cell.classList.add(board[index].toLowerCase());
    }
  });

  if (game.isGameActive()) {
    updateStatus(`Player ${game.getCurrentPlayer()}'s turn`);
  }
}

function updateStatus(message) {
  const statusDisplay = document.getElementById('status');
  if (statusDisplay) {
    statusDisplay.textContent = message;
  }
}

function handleRestartGame() {
  game.resetGame();
  updateDisplay();
}

// Initialize game when DOM is loaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initializeGame);
}

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TicTacToe;
}
