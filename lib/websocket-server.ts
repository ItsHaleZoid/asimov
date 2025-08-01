import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { parse } from 'url';

// Global WebSocket server instance
let wss: WebSocketServer | null = null;
const clients = new Map<string, Set<WebSocket>>();

export function initWebSocketServer(server: any) {
  if (wss) return wss;

  wss = new WebSocketServer({ 
    server,
    path: '/api/ws'
  });

  wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {
    const { pathname, query } = parse(request.url || '', true);
    const jobId = query.jobId as string;

    if (!jobId) {
      ws.close(1008, 'Job ID required');
      return;
    }

    console.log(`WebSocket client connected for job: ${jobId}`);

    // Add client to job-specific set
    if (!clients.has(jobId)) {
      clients.set(jobId, new Set());
    }
    clients.get(jobId)!.add(ws);

    // Send initial connection message
    ws.send(JSON.stringify({
      type: 'connected',
      jobId,
      message: 'WebSocket connection established'
    }));

    ws.on('close', () => {
      console.log(`WebSocket client disconnected for job: ${jobId}`);
      const jobClients = clients.get(jobId);
      if (jobClients) {
        jobClients.delete(ws);
        if (jobClients.size === 0) {
          clients.delete(jobId);
        }
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log('Received WebSocket message:', message);
        
        // Handle different message types if needed
        switch (message.type) {
          case 'ping':
            ws.send(JSON.stringify({ type: 'pong' }));
            break;
          default:
            console.log('Unknown message type:', message.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });
  });

  console.log('WebSocket server initialized');
  return wss;
}

export function broadcastToJob(jobId: string, data: any) {
  const jobClients = clients.get(jobId);
  if (!jobClients || jobClients.size === 0) {
    return;
  }

  const message = JSON.stringify(data);
  
  jobClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });

  console.log(`Broadcasted to ${jobClients.size} clients for job ${jobId}`);
}

export function getConnectedClients(jobId?: string): number {
  if (jobId) {
    return clients.get(jobId)?.size || 0;
  }
  
  let total = 0;
  clients.forEach((jobClients) => {
    total += jobClients.size;
  });
  return total;
}