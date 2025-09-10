"use server";
import { CreateRoomSchema } from "@repo/commons/roomSchemas";
import axios, { AxiosResponse } from "axios";
import { getAuthTokenServer } from "./auth-server";
import db from "@repo/db/prisma";

export const createRoom = async (roomData: CreateRoomSchema) => {
  const token = await getAuthTokenServer();
  const backendUrl = process.env.HTTP_BACKEND_URL;
  if (!backendUrl) {
    throw new Error("HTTP_BACKEND_URL environment variable is not set");
  }

  try {
    console.log("Sending room data:", roomData);
    const response: AxiosResponse<{
      roomName: string;
      roomId: string;
      message: string;
    }> = await axios.post(`${backendUrl}/api/create-room`, roomData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
};

export const getRoom = async (roomId: string) => {
  await getAuthTokenServer();

  try {
    const room = await db.room.findUnique({
      where: {
        id: roomId,
      },
      select: {
        name: true,
        description: true,
        slug: true,
      },
    });
    return {
      name: room?.name,
      slug: room?.slug,
      description: room?.description,
    };
  } catch (error) {
    console.error("Error getting room with id:", roomId, error);
    throw error;
  }
};

export const getExistingRooms = async (userId: string) => {
  try {
    const rooms = await db.room.findMany({
      where: {
        ownerId: userId,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
      },
    });
    return rooms;
  } catch (error) {
    console.error("Error getting existing rooms:", error);
    throw error;
  }
};
