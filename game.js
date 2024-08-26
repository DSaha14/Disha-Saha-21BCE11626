document.addEventListener('DOMContentLoaded', () => {
    const chessboard = document.getElementById('chessboard');
    const currentPlayerDisplay = document.getElementById('current-player');
    const selectedCharacterDisplay = document.getElementById('selected-character');
    const buttons = document.querySelectorAll('.button');
    const historyList = document.getElementById('history');
    const undoButton = document.getElementById('undo');
    const resultDisplay = document.getElementById('result');
    let currentPlayer = 'A';
    let selectedCharacter = null;
    let boardState = [
        ['A-P1', 'A-P2', 'A-H1', 'A-H2', 'A-P3'],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        ['B-P1', 'B-P2', 'B-H1', 'B-H2', 'B-P3'],
    ];
    let moveHistory = [];
    let historyIndex = -1;

    function renderBoard() {
        chessboard.innerHTML = '';
        boardState.forEach((row, rowIndex) => {
            row.forEach((square, colIndex) => {
                const squareDiv = document.createElement('div');
                squareDiv.classList.add('square');
                if (square) {
                    squareDiv.textContent = square;
                }
                squareDiv.addEventListener('click', () => selectCharacter(square, rowIndex, colIndex));
                chessboard.appendChild(squareDiv);
            });
        });
    }

    function selectCharacter(character, row, col) {
        if (character && character.startsWith(currentPlayer)) {
            selectedCharacter = { name: character, row, col };
            selectedCharacterDisplay.textContent = `Selected: ${character}`;
            buttons.forEach(button => {
                button.disabled = false;
                if (character.includes('H2') && ['L', 'R', 'F', 'B'].includes(button.id)) {
                    button.disabled = true;
                } else if (!character.includes('H2') && ['FL', 'FR', 'BL', 'BR'].includes(button.id)) {
                    button.disabled = true;
                }
            });
        }
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => moveCharacter(button.id));
    });

    function moveCharacter(direction) {
        if (!selectedCharacter) return;

        const { name, row, col } = selectedCharacter;
        let newRow = row, newCol = col;
        const moveDistance = name === 'A-H1' || name === 'B-H1' ? 2 : 1;

        switch (direction) {
            case 'L': newCol -= moveDistance; break;
            case 'R': newCol += moveDistance; break;
            case 'F': newRow -= moveDistance; break;
            case 'B': newRow += moveDistance; break;
            case 'FL': newRow -= moveDistance; newCol -= moveDistance; break;
            case 'FR': newRow -= moveDistance; newCol += moveDistance; break;
            case 'BL': newRow += moveDistance; newCol -= moveDistance; break;
            case 'BR': newRow += moveDistance; newCol += moveDistance; break;
        }

        if (newRow >= 0 && newRow < 5 && newCol >= 0 && newCol < 5) {
            if (boardState[newRow][newCol] === null || !boardState[newRow][newCol].startsWith(currentPlayer)) {
                moveHistory = moveHistory.slice(0, historyIndex + 1);
                moveHistory.push({ name, oldRow: row, oldCol: col, newRow, newCol });
                historyIndex++;

                boardState[row][col] = null;
                boardState[newRow][newCol] = name;
                renderBoard();

                if (checkWinner()) {
                    announceWinner();
                } else {
                    switchPlayer();
                }
                updateHistoryDisplay();
            } else {
                alert('Cannot move to a square occupied by your own character!');
            }
        }
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === 'A' ? 'B' : 'A';
        currentPlayerDisplay.textContent = `Current Player: ${currentPlayer}`;
        selectedCharacter = null;
        selectedCharacterDisplay.textContent = 'Selected: None';
        buttons.forEach(button => button.disabled = true);
    }

    function checkWinner() {
        const opponentPlayer = currentPlayer === 'A' ? 'B' : 'A';

        // Check if all characters of the opponent player are eliminated
        const opponentHasCharacters = boardState.flat().some(cell => cell && cell.startsWith(opponentPlayer));

        return !opponentHasCharacters;
    }

    function announceWinner() {
        const winner = currentPlayer === 'A' ? 'A' : 'B';
        resultDisplay.textContent = `Player ${winner} wins the game!`;
        alert(`Player ${winner} wins the game!`);
        resetGame();
    }

    function resetGame() {
        boardState = [
            ['A-P1', 'A-P2', 'A-H1', 'A-H2', 'A-P3'],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            ['B-P1', 'B-P2', 'B-H1', 'B-H2', 'B-P3'],
        ];
        moveHistory = [];
        historyIndex = -1;
        currentPlayer = 'A';
        selectedCharacter = null;
        currentPlayerDisplay.textContent = `Current Player: ${currentPlayer}`;
        selectedCharacterDisplay.textContent = 'Selected: None';
        resultDisplay.textContent = '';
        renderBoard();
        updateHistoryDisplay();
    }

    function updateHistoryDisplay() {
        historyList.innerHTML = '';
        moveHistory.forEach((move, index) => {
            const historyItem = document.createElement('li');
            historyItem.textContent = `Move ${index + 1}: ${move.name} from (${move.oldRow}, ${move.oldCol}) to (${move.newRow}, ${move.newCol})`;
            historyList.appendChild(historyItem);
        });
    }

    function undoMove() {
        if (historyIndex < 0) return;

        const lastMove = moveHistory[historyIndex];
        boardState[lastMove.newRow][lastMove.newCol] = null;
        boardState[lastMove.oldRow][lastMove.oldCol] = lastMove.name;
        renderBoard();
        historyIndex--;
        updateHistoryDisplay();
        switchPlayer();
    }

    undoButton.addEventListener('click', undoMove);

    renderBoard();
});

document.getElementById('show-rules').addEventListener('click', function() {
    document.getElementById('rules-guide').style.display = 'block';
});

document.getElementById('close-rules').addEventListener('click', function() {
    document.getElementById('rules-guide').style.display = 'none';
});