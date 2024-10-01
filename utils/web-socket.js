const WebSocket = require('ws');

let webSocket;
const clients = new Map();

const connectToWS = async (server) => {
    if (!webSocket) {
        const webSocket = new WebSocket.Server({ server });

        webSocket.on('connection', (ws) => {

            ws.on('message', (message) => {
                const msg = message.toString('utf-8')
                if (msg.startsWith('clientId=')) {
                    const clientId = msg.split('=')[1];
                    clients.set(clientId, ws);
                }
            });
        });
    }
}

const sendMessage = async (clientId, message) => {
    const ws = clients.get(clientId);
    if (ws) {
        ws.send(message);
    } else {
        console.error('Client not found:', clientId);
    }
}

module.exports = {
    connectToWS,
    sendMessage
};