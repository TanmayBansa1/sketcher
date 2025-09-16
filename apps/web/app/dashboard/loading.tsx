export default function Loading() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
      <div className="text-center flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
        <p className="text-emerald-600">Setting up your dashboard...</p>
      </div>
    </div>
  );
}


