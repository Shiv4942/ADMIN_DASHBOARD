// This file contains WebSocket utility functions
import { WebSocketServer } from 'ws';

let wss = null;

// Initialize WebSocket server
export const initWebSocket = (server) => {
  if (!wss) {
    wss = new WebSocketServer({ server });
    
    wss.on('connection', (ws) => {
      console.log('New WebSocket connection');
      
      ws.on('close', () => {
        console.log('Client disconnected');
      });
      
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }
  
  return wss;
};

// Broadcast activity to all connected clients
export const broadcastActivity = (activity) => {
  if (!wss) {
    console.warn('WebSocket server not initialized');
    return;
  }
  
  const message = JSON.stringify({
    type: 'new_activity',
    data: activity
  });
  
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};
