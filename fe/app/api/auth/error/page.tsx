"use client"
import { Link } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let message = "Something went wrong.";
  if (error === "AccessDenied") {
    message = "Access Denied. You do not have permission to sign in. Please Login Using UGM Account";
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="p-8 bg-zinc-900 rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>{message}</p>
        <Link href="/" className="mt-4 inline-block text-blue-400 hover:underline">
          Go back to sign in
        </Link>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-black text-white">Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
