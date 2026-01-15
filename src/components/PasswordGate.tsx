"use client";

import { useState, useEffect, ReactNode } from "react";

interface PasswordGateProps {
  children: ReactNode;
  slug: string;
}

export function PasswordGate({ children, slug }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const storageKey = `unlocked_${slug}`;

  useEffect(() => {
    // Check if already unlocked this session
    const unlocked = sessionStorage.getItem(storageKey) === "true";
    setIsUnlocked(unlocked);
    setIsLoading(false);
  }, [storageKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === process.env.NEXT_PUBLIC_CASE_STUDY_PASSWORD) {
      sessionStorage.setItem(storageKey, "true");
      setIsUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[var(--foreground)]/20 border-t-[var(--foreground)] rounded-full animate-spin" />
      </div>
    );
  }

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="w-full max-w-[360px] flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <div className="text-4xl mb-2">🔒</div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Protected Content
          </h1>
          <p className="text-[var(--foreground)]/60">
            This case study requires a password to view.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="Enter password"
            className={`w-full px-4 py-3 rounded-lg bg-[var(--foreground)]/5 border-2 ${
              error
                ? "border-red-500"
                : "border-transparent focus:border-[var(--foreground)]/20"
            } text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 outline-none transition-colors`}
            autoFocus
          />
          {error && (
            <p className="text-red-500 text-sm text-center">
              Incorrect password. Please try again.
            </p>
          )}
          <button
            type="submit"
            className="w-full px-4 py-3 rounded-lg bg-[var(--foreground)] text-[var(--background)] font-medium hover:opacity-90 transition-opacity"
          >
            Unlock
          </button>
        </form>

        <p className="text-[var(--foreground)]/40 text-sm text-center">
          Contact me if you need access.
        </p>
      </div>
    </div>
  );
}
