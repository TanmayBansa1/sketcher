import { z } from "zod";

export const createRoomSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    password: z.string().optional(),
    slug: z.string().min(1),
});

export type CreateRoomSchema = z.infer<typeof createRoomSchema>;