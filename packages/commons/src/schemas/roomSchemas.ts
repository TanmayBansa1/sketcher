import { z } from "zod";

export const createRoomSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1).optional(),
    password: z.string().min(1).optional(),
    slug: z.string().min(1),
});

export type CreateRoomSchema = z.infer<typeof createRoomSchema>;