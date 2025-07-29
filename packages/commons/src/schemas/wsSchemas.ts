import { z } from "zod";

export const userRequestMessageSchema = z.object({
    type: z.enum(['join_room', 'leave_room', 'room_message', 'get_stats']),
    roomId: z.string().min(1).optional(),
    message: z.string().min(1).optional(),
});

export type UserRequestMessageSchema = z.infer<typeof userRequestMessageSchema>;
