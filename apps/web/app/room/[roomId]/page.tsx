import { getRoom } from "@/lib/roomUtils";
import dynamic from "next/dynamic";

const CustomCanvas = dynamic(() => import("@/components/CustomCanvas"));

export default async function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
    const { roomId } = await params;
    const room = await getRoom(roomId); 
    return <div className="h-screen bg-amber-100">
        <CustomCanvas room={room as {name: string, slug: string, description: string}} />
    </div>;
}