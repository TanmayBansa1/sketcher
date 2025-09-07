"use server";
import { CreateRoomSchema } from "@repo/commons/roomSchemas";
import axios, { AxiosResponse } from "axios";
import { getAuthToken } from "./auth";
import db from "@repo/db/prisma";

export const createRoom = async (roomData: CreateRoomSchema)  => {

    const token = await getAuthToken();
    const backendUrl = process.env.HTTP_BACKEND_URL;
    if (!backendUrl) {
        throw new Error('HTTP_BACKEND_URL environment variable is not set');
    }
    
    try {
        console.log("Sending room data:", roomData);
        const response : AxiosResponse<{roomName: string, roomId: string, message: string}> = await axios.post(`${backendUrl}/api/create-room`, roomData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log("Response received:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error creating room:", error);
        if (axios.isAxiosError(error) && error.response) {
            console.error("Backend error details:", error.response.data);
            console.error("Backend status:", error.response.status);
        }
        throw error;
    }
}

export const getRoom = async (roomId: string) => {

    await getAuthToken();
    
    const room = await db.room.findUnique({
        where: {
            id: roomId
        }, select: {
            name: true,
            description: true,
            slug: true
        }
    })
    return {
        name: room?.name,
        slug: room?.slug,
        description: room?.description
    };
}