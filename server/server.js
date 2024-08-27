const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let games = {};

wss.on('connection', ws => {
    console.log('Client connected');

    ws.on('message', message => {
        const data = JSON.parse(message);
        const { type, payload } = data;

        switch (type) {
            case 'createGame':
                const gameId = generateGameId();
                games[gameId] = initializeGame();
                ws.send(JSON.stringify({ type: 'gameCreated', payload: { gameId } }));
                break;

            case 'joinGame':
                if (games[payload.gameId]) {
                    ws.gameId = payload.gameId;
                    games[payload.gameId].players.push(ws);
                    ws.send(JSON.stringify({ type: 'gameJoined', payload: { gameState: games[payload.gameId].state } }));
                } else {
                    ws.send(JSON.stringify({ type: 'error', payload: { message: 'Game not found' } }));
                }
                break;

            case 'makeMove':
                const game = games[ws.gameId];
                if (game && validateMove(game, payload.move)) {
                    applyMove(game, payload.move);
                    broadcastGameState(game);
                } else {
                    ws.send(JSON.stringify({ type: 'invalidMove' }));
                }
                break;
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

function generateGameId() {
    return Math.random().toString(36).substr(2, 9);
}

function initializeGame() {
    return {
        state: initialState(),
        players: []
    };
}

function initialState() {
    // Initialize the 5x5 grid and place characters
    return {
        board: [
            ['A-H1', 'A-P1', 'A-H2', '', ''],
            ['', '', '', 'B-P1', 'B-H1'],
        ],
        turn: 'A'
    };
}

function validateMove(game, move) {
    // Add your move validation logic here
    return true;
}

function applyMove(game, move) {
    // Update the game state based on the move
}

function broadcastGameState(game) {
    const gameState = JSON.stringify({ type: 'gameStateUpdate', payload: game.state });
    game.players.forEach(player => player.send(gameState));
}

console.log('WebSocket server is running on ws://localhost:8080');
