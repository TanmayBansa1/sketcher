import { getAuthTokenServer } from "@/lib/auth";
import dynamic from "next/dynamic";

const MainCanvas = dynamic(() => import("@/components/MainCanvas"));

export default async function RoomPage({ params }: { params: Promise<{ roomSlug: string }> }) {
    const { roomSlug } = await params;
    const token = await getAuthTokenServer();
    
    // Get WebSocket URL from server-side environment variable
    const wsUrl = process.env.WS_BACKEND_URL || 'ws://localhost:8080';
    
    return <div className="h-screen">
        <MainCanvas roomSlug={roomSlug} token={token} wsUrl={wsUrl} />
    </div>;
}