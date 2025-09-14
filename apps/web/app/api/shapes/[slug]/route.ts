import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getAuthTokenServer } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const token = await getAuthTokenServer();
    const { slug } = await params;

    const backendUrl = process.env.HTTP_BACKEND_URL || "http://localhost:3001";
    const response = await axios.get(`${backendUrl}/api/shapes/${slug}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(response.data.shapes);
  } catch (error) {
    console.error("Error in shapes API route:", error);
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
