"use client";

import React, { useEffect } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 text-base-content p-6 text-center">
      <div className="bg-error/10 text-error p-6 rounded-full mb-6">
        <FiAlertTriangle className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-bold mb-3">Something went wrong!</h1>
      <p className="text-slate-500 mb-8 max-w-md">
        An unexpected error occurred. We have been notified and are looking into it.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="btn btn-primary rounded-xl"
        >
          Try again
        </button>
        <Link href="/" className="btn btn-outline rounded-xl">
          Go Home
        </Link>
      </div>
    </div>
  );
}
