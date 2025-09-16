"use client";

import { useRouter } from "next/navigation";
import { Room } from "@/lib/types";

export default function RoomCard({ room }: { room: Room }) {
  const router = useRouter();

  const handleRoomNavigation = () => {
    router.push(`/room/${room.slug}`);
  };

  return (
    <div 
      className="border border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors" 
      onClick={handleRoomNavigation}
    >
      <h3 className="text-lg font-semibold text-gray-800">{room.name}</h3>
      <p className="text-gray-600">{room.description}</p>
    </div>
  );
}
