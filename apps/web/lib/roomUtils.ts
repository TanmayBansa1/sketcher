"use server";
import { CreateRoomSchema } from "@repo/commons/roomSchemas";
import axios from "axios";
import { auth } from "@clerk/nextjs/server";

export const createRoom = async (roomData: CreateRoomSchema) => {
    const {getToken} = await auth();
    const token = await getToken();
    
    if (!token) {
        throw new Error('User not authenticated');
    }
    
    const backendUrl = process.env.HTTP_BACKEND_URL;
    if (!backendUrl) {
        throw new Error('HTTP_BACKEND_URL environment variable is not set');
    }
    
    try {
        console.log("Sending room data:", roomData);
        const response = await axios.post(`${backendUrl}/api/create-room`, roomData, {
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