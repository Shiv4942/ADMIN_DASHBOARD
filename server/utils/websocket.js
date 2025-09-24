// This file contains WebSocket utility functions
import { WebSocketServer } from 'ws';

let wss = null;

// Initialize WebSocket server
export const initWebSocket = (server) => {
  if (!wss) {
    wss = new WebSocketServer({ 
      server,
      clientTracking: true,
      // Increase the maximum payload size if needed
      maxPayload: 10 * 1024 * 1024 // 10MB
    });
    
    wss.on('connection', (ws, req) => {
      const clientIp = req.socket.remoteAddress;
      console.log(`New WebSocket connection from ${clientIp}`);
      
      // Send a welcome message
      ws.send(JSON.stringify({ 
        type: 'connection', 
        status: 'connected',
        timestamp: new Date().toISOString()
      }));
      
      ws.on('close', (code, reason) => {
        console.log(`Client ${clientIp} disconnected. Code: ${code}, Reason: ${reason || 'No reason provided'}`);
      });
      
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
      
      // Handle ping/pong to keep the connection alive
      ws.isAlive = true;
      ws.on('pong', () => {
        ws.isAlive = true;
      });
    });
    
    // Ping all clients every 30 seconds to check if they're still connected
    const interval = setInterval(() => {
      if (wss) {
        wss.clients.forEach((ws) => {
          if (ws.isAlive === false) {
            console.log('Terminating dead WebSocket connection');
            return ws.terminate();
          }
          ws.isAlive = false;
          ws.ping(() => {});
        });
      }
    }, 30000);
    
    // Clean up interval on server close
    wss.on('close', () => {
      clearInterval(interval);
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
    data: activity,
    timestamp: new Date().toISOString()
  });
  
  let clientCount = 0;
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      clientCount++;
      client.send(message, (error) => {
        if (error) {
          console.error('Error sending WebSocket message:', error);
        }
      });
    }
  });
  
  console.log(`Broadcasted activity to ${clientCount} connected clients`);
  return clientCount;
};

// Export the WebSocket server instance
export { wss };
