import { getRoom } from "@/lib/roomUtils";

export default async function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
    const { roomId } = await params;
    const room = await getRoom(roomId);
    return <div className="h-screen bg-black"><p className="text-white">{room.name}</p></div>;
}