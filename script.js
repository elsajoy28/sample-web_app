// Functions for General Settings
function changeBackgroundColor(color) {
    document.body.style.backgroundColor = color;
}

function changeFont(font) {
    document.body.style.fontFamily = font;
}

function changeFontSize(size) {
    document.body.style.fontSize = size;
}

// Accessibility Options
const charSizeRange = document.getElementById('charSizeRange');
charSizeRange.addEventListener('input', function() {
    document.body.style.fontSize = this.value + 'px';
});

const charSpaceRange = document.getElementById('charSpaceRange');
charSpaceRange.addEventListener('input', function() {
    document.body.style.letterSpacing = this.value + 'em';
});

const fontColorSelect = document.getElementById('fontColorSelect');
fontColorSelect.addEventListener('input', function() {
    document.body.style.color = this.value;
});

const pageColorSelect = document.getElementById('pageColorSelect');
pageColorSelect.addEventListener('input', function() {
    document.body.style.background = this.value;
});

// Game Functions
const words = ["hello", "world", "javascript", "hangman"];
let selectedWord, remainingGuesses, guessedLetters;
let currentPlayer, gameActive, gameState;

function showGame(game) {
    const gameArea = document.getElementById('gameArea');
    switch (game) {
        case 'hangman':
            selectedWord = words[Math.floor(Math.random() * words.length)];
            remainingGuesses = 6;
            guessedLetters = [];
            gameArea.innerHTML = `
                <h2>Hangman Game</h2>
                <div id="wordSpotlight" class="game-info">${"_ ".repeat(selectedWord.length)}</div>
                <div id="alphabet" class="game-buttons"></div>
                <p id="guesses" class="game-info">Remaining Guesses: 6</p>
            `;
            initializeHangman();
            break;
        case 'ticTacToe':
            currentPlayer = 'X';
            gameActive = true;
            gameState = Array(9).fill(null);
            gameArea.innerHTML = `
                <h2>Tic Tac Toe</h2>
                <div id="ticTacToeGrid" class="tictactoe-grid"></div>
                <p id="gameStatus" class="game-info">Player X's turn</p>
                <button onclick="initializeTicTacToe()" class="game-buttons">Restart Game</button>
            `;
            initializeTicTacToe();
            break;
        case 'rockPaperScissors':
            gameArea.innerHTML = `
                <h2>Rock Paper Scissors</h2>
                <div id="rockPaperScissorsButtons" class="game-buttons">
                    <button onclick="playGame('rock')">Rock</button>
                    <button onclick="playGame('paper')">Paper</button>
                    <button onclick="playGame('scissors')">Scissors</button>
                </div>
                <p id="gameResult" class="game-info"></p>
            `;
            break;
        default:
            gameArea.innerHTML = '<p>Select a game from the navigation menu.</p>';
    }
}

// Hangman Functions
function initializeHangman() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz".split("").map(letter =>
        `<button onclick="handleGuess('${letter}')" id="btn-${letter}" class="game-buttons">${letter}</button>`
    ).join('');
    document.getElementById('alphabet').innerHTML = alphabet;
    updateWordDisplay();
}

function updateWordDisplay() {
    const display = selectedWord.split('').map(letter => (guessedLetters.includes(letter) ? letter : "_")).join(' ');
    document.getElementById('wordSpotlight').textContent = display;
    if (!display.includes("_")) {
        document.getElementById('alphabet').innerHTML = '<p>You have won!</p>';
        remainingGuesses = 0;
    }
}

function handleGuess(letter) {
    if (!guessedLetters.includes(letter)) {
        guessedLetters.push(letter);
        document.getElementById(`btn-${letter}`).disabled = true;
        if (!selectedWord.includes(letter)) {
            remainingGuesses--;
            document.getElementById('guesses').textContent = `Remaining Guesses: ${remainingGuesses}`;
            if (remainingGuesses <= 0) {
                document.getElementById('alphabet').innerHTML = `<p>Game over! The word was ${selectedWord}.</p>`;
                return;
            }
        }
        updateWordDisplay();
    }
}

// Tic Tac Toe Functions
function initializeTicTacToe() {
    const grid = document.getElementById('ticTacToeGrid');
    grid.innerHTML = ''; // Clear previous content
    for (let i = 0; i < 3; i++) {
        let row = document.createElement('div');
        row.className = 'tictactoe-row';
        for (let j = 0; j < 3; j++) {
            let cell = document.createElement('div');
            cell.className = 'tictactoe-square';
            cell.addEventListener('click', () => makeMove(i * 3 + j));
            row.appendChild(cell);
        }
        grid.appendChild(row);
    }
    document.getElementById('gameStatus').textContent = `Player ${currentPlayer}'s turn`;
}

function makeMove(index) {
    if (gameState[index] || !gameActive) return;
    gameState[index] = currentPlayer;
    document.getElementById('ticTacToeGrid').children[Math.floor(index / 3)].children[index % 3].textContent = currentPlayer;
    checkWinner();
}

function checkWinner() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]            // Diagonals
    ];
    let roundWon = false;
    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            gameActive = false;
            break;
        }
    }
    if (roundWon) {
        document.getElementById('gameStatus').textContent = `Player ${currentPlayer} wins!`;
        return;
    }
    if (!gameState.includes(null)) {
        document.getElementById('gameStatus').textContent = "Draw!";
        gameActive = false;
        return;
    }
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('gameStatus').textContent = `Player ${currentPlayer}'s turn`;
}

// Rock Paper Scissors Functions
function playGame(playerChoice) {
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * 3)];
    const result = determineWinner(playerChoice, computerChoice);
    document.getElementById('gameResult').textContent = `You chose ${playerChoice}, computer chose ${computerChoice}. ${result}`;
}

function determineWinner(player, computer) {
    if (player === computer) {
        return "It's a draw!";
    }
    if ((player === 'rock' && computer === 'scissors') ||
        (player === 'paper' && computer === 'rock') ||
        (player === 'scissors' && computer === 'paper')) {
        return "You win!";
    }
    return "You lose!";
}

// Search Function
function searchGames() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const games = ['Hangman', 'Tic Tac Toe', 'Rock Paper Scissors'];
    const results = games.filter(game => game.toLowerCase().includes(query));
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = results.map(game => `<li onclick="showGame('${game.toLowerCase().replace(' ', '')}')">${game}</li>`).join('');
}
