import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import { DecodedTokenSchema } from '@repo/commons/authSchemas';
import dotenv from 'dotenv';
dotenv.config();

const wss = new WebSocketServer({ port: 8080 });

const rooms : Record<string, WebSocket[]> = {};

wss.on('connection', function connection(ws, request) {
  const url = request.url;
  const token = new URLSearchParams(url?.split('?')[1] || '').get('token');
  if(!token){
    console.log('No token provided');
    ws.send(JSON.stringify({
      type: 'error',
      message: 'No token provided'
    }));
    ws.close();
    return;
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedTokenSchema;

  if(!decoded.userId){
    console.log('Invalid token');
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Invalid token'
    }));
    ws.close();
    return;
  }

  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});



