"use client";
import { SignOutButton } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { syncUser } from "@/lib/sync-user";
import { CreateRoomModal } from "@/components/createRoomModal";
import { LoaderOne } from "@/components/ui/loader";
import { LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function Dashboard() {
  const [isSyncing, setIsSyncing] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);
  useEffect(() => {
    const sync = async () => {
      try {
        await syncUser();
      } catch (error) {
        console.error("Error syncing user:", error);
        setSyncError("There was an error syncing your data. Please try reloading the page or signing up again.");
      } finally {
        setIsSyncing(false);
      }
    };
    sync();
  }, []);

  if (isSyncing) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
        <div className="text-center flex flex-col items-center gap-4">
          <LoaderOne></LoaderOne>
          <p className="text-emerald-600">Setting up your dashboard...</p>
        </div>
      </div>
    );
  }

  if (syncError) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-red-600 mb-4">Error setting up your account</p>
          <p className="text-gray-600 text-sm">{syncError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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

        <div className=" w-fit mt-8">
          <CreateRoomModal></CreateRoomModal>
        </div>
      </div>
    </div>
  );
}
