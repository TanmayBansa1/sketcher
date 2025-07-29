import { WebSocketServer, WebSocket } from 'ws';
import dotenv from 'dotenv';
import { checkUserToken } from './util/auth.js';
import { state } from './state.js';
import { handleMessage } from './lib/messageHandler.js';

dotenv.config();

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws, request) {
  const url = request.url;
  const token = new URLSearchParams(url?.split('?')[1] || '').get('token');
  const userId = checkUserToken(ws, token);

  if (!userId) {
    return; // Connection already closed by checkUserToken
  }

  
  // Add user to state
  state.addUser(userId, ws);
  console.log(`User ${userId} connected`);

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connected',
    userId: userId,
    message: 'Successfully connected to WebSocket server'
  }));

  ws.on('error', (error) => {
    console.error(`WebSocket error for user ${userId}:`, error);
    state.removeUser(userId);
  });

  ws.on('close', () => {
    console.log(`User ${userId} disconnected`);
    state.removeUser(userId);
  });

  ws.on('message', function message(data) {
    try {
      const messageData = JSON.parse(data.toString());
      handleMessage(userId, messageData);
    } catch (error) {
      console.error('Error parsing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format'
      }));
    }
  });
});

// Periodic cleanup of disconnected users
setInterval(() => {
  state.cleanup();
}, 30000); // Every 30 seconds

console.log('WebSocket server running on port 8080');



