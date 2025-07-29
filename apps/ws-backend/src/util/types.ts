import { WebSocket } from 'ws';

export interface User {
    userId: string;
    rooms: string[];
    ws: WebSocket;
    lastSeen?: Date;
}

export interface Room {
    roomId: string;
    users: string[];
    createdAt: Date;
}

