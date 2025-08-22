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
      
      // Check for winner immediately after move
      const result = this.checkWinner();
      if (!result) {
        this.switchPlayer();
      }
      return true;
    }
    return false;
  }

  checkWinner() {
    // First check if there's already a natural winner
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

    // Check if board is full (potential draw scenario)
    let roundDraw = !this.board.includes('');
    if (roundDraw) {
      // Apply longest-line tie-break logic instead of forcing a random win
      const tieBreakWinner = this.determineTieBreakWinner();
      this.gameActive = false;
      return `Player ${tieBreakWinner} wins! (Tie-break: longest connected sequence)`;
    }

    return null;
  }

  /**
   * TIE-BREAK LOGIC: When the board is full with no standard winner,
   * find the player with the longest sequence of adjacent marks.
   * If both players have the same longest sequence, prefer O as winner.
   */
  determineTieBreakWinner() {
    const xLongest = this.findLongestSequence('X');
    const oLongest = this.findLongestSequence('O');
    
    console.log('Tie-break analysis:');
    console.log('X longest sequence:', xLongest);
    console.log('O longest sequence:', oLongest);
    
    // If O has longer or equal sequence, O wins (preference for O on tie)
    if (oLongest >= xLongest) {
      return 'O';
    } else {
      return 'X';
    }
  }

  /**
   * Find the longest sequence of adjacent marks for a given player.
   * Checks all possible directions: horizontal, vertical, and diagonal.
   */
  findLongestSequence(player) {
    let maxLength = 0;
    
    // Check all possible starting positions
    for (let i = 0; i < 9; i++) {
      if (this.board[i] === player) {
        // Check horizontal sequences (rows)
        const row = Math.floor(i / 3);
        const col = i % 3;
        
        // Horizontal (right direction)
        if (col === 0) { // Start from leftmost column
          let length = 0;
          for (let c = 0; c < 3; c++) {
            if (this.board[row * 3 + c] === player) {
              length++;
            } else {
              break;
            }
          }
          maxLength = Math.max(maxLength, length);
        }
        
        // Vertical (down direction)
        if (row === 0) { // Start from top row
          let length = 0;
          for (let r = 0; r < 3; r++) {
            if (this.board[r * 3 + col] === player) {
              length++;
            } else {
              break;
            }
          }
          maxLength = Math.max(maxLength, length);
        }
        
        // Diagonal (top-left to bottom-right)
        if (i === 0) {
          let length = 0;
          for (let d = 0; d < 3; d++) {
            if (this.board[d * 4] === player) { // positions 0, 4, 8
              length++;
            } else {
              break;
            }
          }
          maxLength = Math.max(maxLength, length);
        }
        
        // Diagonal (top-right to bottom-left)
        if (i === 2) {
          let length = 0;
          for (let d = 0; d < 3; d++) {
            if (this.board[2 + d * 2] === player) { // positions 2, 4, 6
              length++;
            } else {
              break;
            }
          }
          maxLength = Math.max(maxLength, length);
        }
      }
    }
    
    // Also check for non-contiguous sequences in any direction
    // This covers cases where marks are adjacent but not necessarily starting from edge
    maxLength = Math.max(maxLength, this.findMaxAdjacentSequence(player));
    
    return maxLength;
  }

  /**
   * Find the maximum adjacent sequence anywhere on the board for a player.
   * This method checks all possible adjacent connections.
   */
  findMaxAdjacentSequence(player) {
    const visited = new Array(9).fill(false);
    let maxSequence = 0;
    
    for (let i = 0; i < 9; i++) {
      if (this.board[i] === player && !visited[i]) {
        const sequenceLength = this.dfsSequenceLength(i, player, visited);
        maxSequence = Math.max(maxSequence, sequenceLength);
      }
    }
    
    return maxSequence;
  }

  /**
   * Depth-first search to find connected sequence length.
   * Considers horizontal, vertical, and diagonal adjacency.
   */
  dfsSequenceLength(position, player, visited) {
    visited[position] = true;
    let length = 1;
    
    // Get adjacent positions
    const adjacentPositions = this.getAdjacentPositions(position);
    
    for (const adjPos of adjacentPositions) {
      if (!visited[adjPos] && this.board[adjPos] === player) {
        length += this.dfsSequenceLength(adjPos, player, visited);
      }
    }
    
    return length;
  }

  /**
   * Get all adjacent positions for a given board position.
   * Includes horizontal, vertical, and diagonal adjacency.
   */
  getAdjacentPositions(position) {
    const adjacent = [];
    const row = Math.floor(position / 3);
    const col = position % 3;
    
    // Check all 8 possible directions
    for (let dRow = -1; dRow <= 1; dRow++) {
      for (let dCol = -1; dCol <= 1; dCol++) {
        if (dRow === 0 && dCol === 0) continue; // Skip self
        
        const newRow = row + dRow;
        const newCol = col + dCol;
        
        if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
          adjacent.push(newRow * 3 + newCol);
        }
      }
    }
    
    return adjacent;
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
