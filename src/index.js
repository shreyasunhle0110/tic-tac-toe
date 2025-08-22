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
      // NO DRAW LOGIC: If the board is full and no one has won,
      // force a win by changing the last empty cell to create a winning line
      this.forceWin();
      this.gameActive = false;
      return `Player ${this.currentPlayer} wins! (Forced to avoid draw)`;
    }

    return null;
  }

  // Force a win when the board would result in a draw
  forceWin() {
    // Find the last move made (current player's move)
    const lastMoveIndex = this.findLastEmptyIndex();
    
    // Try to create a winning line by modifying adjacent cells
    for (let i = 0; i < this.winningConditions.length; i++) {
      const winCondition = this.winningConditions[i];
      const [pos1, pos2, pos3] = winCondition;
      
      // Check if we can create a winning line for the current player
      const values = [this.board[pos1], this.board[pos2], this.board[pos3]];
      const playerCount = values.filter(val => val === this.currentPlayer).length;
      const emptyCount = values.filter(val => val === '').length;
      
      // If current player has 2 positions and 1 is empty, fill it
      if (playerCount === 2 && emptyCount === 1) {
        const emptyIndex = winCondition.find(pos => this.board[pos] === '');
        this.board[emptyIndex] = this.currentPlayer;
        return;
      }
    }
    
    // If no natural winning line can be created, force one by changing an opponent's move
    const oppositePlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    
    // Find a winning condition where current player has at least 1 position
    for (let i = 0; i < this.winningConditions.length; i++) {
      const winCondition = this.winningConditions[i];
      const [pos1, pos2, pos3] = winCondition;
      
      const values = [this.board[pos1], this.board[pos2], this.board[pos3]];
      const playerCount = values.filter(val => val === this.currentPlayer).length;
      
      if (playerCount >= 1) {
        // Change opponent's positions to current player's
        winCondition.forEach(pos => {
          if (this.board[pos] === oppositePlayer) {
            this.board[pos] = this.currentPlayer;
          }
        });
        
        // Fill any remaining empty positions
        winCondition.forEach(pos => {
          if (this.board[pos] === '') {
            this.board[pos] = this.currentPlayer;
          }
        });
        return;
      }
    }
  }

  findLastEmptyIndex() {
    for (let i = this.board.length - 1; i >= 0; i--) {
      if (this.board[i] !== '') {
        return i;
      }
    }
    return 0;
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
