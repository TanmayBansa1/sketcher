import { SignOutButton } from "@clerk/nextjs";
import React from "react";
import { syncUser } from "@/lib/sync-user";
import { CreateRoomModal } from "@/components/createRoomModal";
import { LoaderOne } from "@/components/ui/loader";
import { LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getExistingRooms } from "@/lib/roomUtils";
import { auth } from "@clerk/nextjs/server";
import  RoomCard  from "@/components/RoomCard";
export default async function Dashboard() {
  await syncUser();
  const { userId } = await auth();
  if (!userId) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
        <div className="text-center flex flex-col items-center gap-4">
          <LoaderOne></LoaderOne>
          <p className="text-emerald-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  const existingRooms = await getExistingRooms(userId);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto pt-8">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex-shrink-0">
            <Button
              variant="outline"
              size="icon"
              className="px-4 py-2 cursor-pointer"
            >
              <SignOutButton>
                <span className="flex items-center gap-2 text-black">
                  <LogOutIcon className="w-4 h-4" />
                  Sign Out
                </span>
              </SignOutButton>
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Welcome to your Dashboard
          </h2>
          <p className="text-gray-600">
            Your account has been successfully set up and synchronized.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 border border-dashed border-gray-300 rounded-lg p-4 mt-4">
          {/* Display the rooms that the user has created */}
          {existingRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>

        <div className=" w-fit mt-8">
          <CreateRoomModal></CreateRoomModal>
        </div>

      </div>
    </div>
  );
}
