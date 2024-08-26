const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let gameState = {
    board: [
        ['A-P1', 'A-P2', 'A-H1', 'A-H2', 'A-P3'],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        ['B-P1', 'B-P2', 'B-H1', 'B-H2', 'B-P3'],
    ],
    currentPlayer: 'A'
};

wss.on('connection', (ws) => {
    ws.send(JSON.stringify({ type: 'INIT', state: gameState }));

    ws.on('message', (message) => {
        const action = JSON.parse(message);

        switch (action.type) {
            case 'MOVE':
                handleMove(action.payload);
                broadcast(gameState);
                break;
        }
    });
});

function handleMove({ character, direction }) {
    // Implement the logic to update gameState based on character and direction.
    // Example: Move character on the board, switch player turn, etc.
    // (This part will depend on the specific rules of your game)
    
    gameState.currentPlayer = gameState.currentPlayer === 'A' ? 'B' : 'A';
}

function broadcast(state) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'UPDATE', state }));
        }
    });
}

