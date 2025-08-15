"use client";
import { SignOutButton } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { syncUser } from "../../lib/sync-user";

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
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
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
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Dashboard</h1>
      <div>
        <SignOutButton></SignOutButton>
      </div>
    </div>
  );
}
