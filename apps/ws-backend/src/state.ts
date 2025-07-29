import { WebSocket } from 'ws';
import { User, Room } from './util/types.js';


class State {
    private static instance: State;
    private users: Record<string, User>;
    private rooms: Record<string, Room>;

    private constructor() {
        this.users = {};
        this.rooms = {};
    }

    public static getInstance(): State {
        if (!State.instance) {
            State.instance = new State();
        }
        return State.instance;
    }

    // User management methods
    public addUser(userId: string, ws: WebSocket): void {
        if (this.users[userId]) {
            console.warn(`User ${userId} already exists, updating connection`);
        }
        
        this.users[userId] = {
            userId,
            rooms: [],
            ws,
            lastSeen: new Date()
        };
    }

    public removeUser(userId: string): void {
        if (!this.users[userId]) {
            console.warn(`User ${userId} not found for removal`);
            return;
        }

        // Remove user from all rooms
        const user = this.users[userId];
        user.rooms.forEach(roomId => {
            this.leaveRoom(userId, roomId);
        });

        delete this.users[userId];
    }

    public getUser(userId: string): User | undefined {
        return this.users[userId];
    }

    public getAllUsers(): User[] {
        return Object.values(this.users);
    }

    // Room management methods
    public createRoom(roomId: string): void {
        if (this.rooms[roomId]) {
            console.warn(`Room ${roomId} already exists`);
            return;
        }

        this.rooms[roomId] = {
            roomId,
            users: [],
            createdAt: new Date()
        };
    }

    public joinRoom(userId: string, roomId: string): boolean {
        const user = this.users[userId];
        const room = this.rooms[roomId];

        if (!user) {
            console.error(`User ${userId} not found`);
            return false;
        }

        if (!room) {
            console.error(`Room ${roomId} not found`);
            return false;
        }

        if (user.rooms.includes(roomId)) {
            console.warn(`User ${userId} already in room ${roomId}`);
            return false;
        }

        user.rooms.push(roomId);
        room.users.push(userId);
        return true;
    }

    public leaveRoom(userId: string, roomId: string): boolean {
        const user = this.users[userId];
        const room = this.rooms[roomId];

        if (!user || !room) {
            return false;
        }

        user.rooms = user.rooms.filter(r => r !== roomId);
        room.users = room.users.filter(u => u !== userId);

        // // Clean up empty rooms
        // if (room.users.length === 0) {
        //     delete this.rooms[roomId];
        // }

        return true;
    }

    public getRoomUsers(roomId: string): User[] {
        const room = this.rooms[roomId];
        if (!room) return [];
        
        return room.users
            .map(userId => this.users[userId])
            .filter((user): user is User => user !== undefined);
    }

    public getRoom(roomId: string): Room | undefined {
        return this.rooms[roomId];
    }

    public getAllRooms(): Room[] {
        return Object.values(this.rooms);
    }

    // Broadcasting methods
    public broadcastToRoom(roomId: string, message: string, excludeUserId?: string): void {
        const room = this.rooms[roomId];
        if (!room) return;

        room.users.forEach(userId => {
            if (userId === excludeUserId) return;
            
            const user = this.users[userId];
            if (user && user.ws.readyState === WebSocket.OPEN) {
                user.ws.send(message);
            }
        });
    }

    public broadcastToUser(userId: string, message: string): void {
        const user = this.users[userId];
        if (user && user.ws.readyState === WebSocket.OPEN) {
            user.ws.send(message);
        }
    }

    // Utility methods
    public updateUserLastSeen(userId: string): void {
        const user = this.users[userId];
        if (user) {
            user.lastSeen = new Date();
        }
    }

    public getStats() {
        return {
            totalUsers: Object.keys(this.users).length,
            totalRooms: Object.keys(this.rooms).length,
            users: Object.keys(this.users),
            rooms: Object.keys(this.rooms)
        };
    }

    public cleanup(): void {
        // Remove users with closed connections
        Object.keys(this.users).forEach(userId => {
            const user = this.users[userId];
            if (user && user.ws.readyState === WebSocket.CLOSED) {
                this.removeUser(userId);
            }
        });
    }
}

export const state = State.getInstance();