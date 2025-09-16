import { getAuthTokenServer } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthTokenServer();
    const body = await request.json();
    const backendUrl = process.env.HTTP_BACKEND_URL || "http://localhost:3001";
    
    const response = await axios.post(`${backendUrl}/api/create-room`, body, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error in create-room API route:", error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data.message },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unknown error occured" },
      { status: 500 }
    );
  }
}
