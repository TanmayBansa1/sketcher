"use client";
import React from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
      <div className="text-center">
        <div className="text-red-500 mb-4">⚠️</div>
        <p className="text-red-600 mb-4">Error setting up your account</p>
        <p className="text-gray-600 text-sm">{error.message}</p>
        <button
          onClick={() => reset()}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}


