import { state } from "../state.js";
import { userRequestMessageSchema, UserRequestMessageSchema } from "@repo/commons/wsSchemas";
import db from "@repo/db/prisma";

export async function handleMessage(userId: string, messageData: UserRequestMessageSchema) {
    const parsedMessage = userRequestMessageSchema.safeParse(messageData);
    if (!parsedMessage.success) {
      state.broadcastToUser(userId, JSON.stringify({
        type: 'error',
        message: 'Invalid message format',
        errors: parsedMessage.error.issues.map((issue) => issue.message)
      }));
      return;
    }
    const { type, roomSlug, message } = parsedMessage.data;
    const room = await db.room.findUnique({
      where: {
        slug: roomSlug
      }
    });
    if (!room) {
      state.broadcastToUser(userId, JSON.stringify({
        type: 'error',
        message: 'Room not found'
      }));
      return;
    }
    const roomId = room.id;
    switch (type) {
      case 'join_room':
        if (!roomId) {
          state.broadcastToUser(userId, JSON.stringify({
            type: 'error',
            message: 'Room ID required'
          }));
          return;
        }

        if(!state.getRoom(roomId)) {
          state.createRoom(roomId);
        }
        
        if (state.joinRoom(userId, roomId)) {
          // Notify user of successful join
          state.broadcastToUser(userId, JSON.stringify({
            type: 'joined_room',
            roomId: roomId
          }));
  
          // Notify other users in room
          state.broadcastToRoom(roomId, JSON.stringify({
            type: 'user_joined',
            userId: userId,
            roomId: roomId
          }), userId);
        } else {
          state.broadcastToUser(userId, JSON.stringify({
            type: 'error',
            message: 'Failed to join room'
          }));
        }
        break;
  
      case 'leave_room':
        if (!roomId) {
          state.broadcastToUser(userId, JSON.stringify({
            type: 'error',
            message: 'Room ID required'
          }));
          return;
        }
  
        if (state.leaveRoom(userId, roomId)) {
          // Notify user of successful leave
          state.broadcastToUser(userId, JSON.stringify({
            type: 'left_room',
            roomId: roomId
          }));
  
          // Notify other users in room
          state.broadcastToRoom(roomId, JSON.stringify({
            type: 'user_left',
            userId: userId,
            roomId: roomId
          }), userId);
        }
        break;
  
      case 'room_message':
        if (!roomId || !message) {
          state.broadcastToUser(userId, JSON.stringify({
            type: 'error',
            message: 'Room ID and message required'
          }));
          return;
        }
  
        // Check if user is in the room
        const user = state.getUser(userId);
        if (!user || !user.rooms.includes(roomId)) {
          state.broadcastToUser(userId, JSON.stringify({
            type: 'error',
            message: 'You are not in this room'
          }));
          return;
        }

        await db.shape.create({
            data: {
                roomId: roomId,
                senderId: userId,
                message: message
            }
        })
  
        // Broadcast message to room
        state.broadcastToRoom(roomId, JSON.stringify({
          type: 'room_message',
          userId: userId,
          roomId: roomId,
          message: message
        }));
        break;
  
      case 'get_stats':
        const stats = state.getStats();
        state.broadcastToUser(userId, JSON.stringify({
          type: 'stats',
          data: stats
        }));
        break;
  
      default:
        state.broadcastToUser(userId, JSON.stringify({
          type: 'error',
          message: 'Unknown message type'
        }));
    }
  }