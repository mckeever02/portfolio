"use client";

import { useState, useEffect, ReactNode } from "react";
import { ASCIIText } from "./ASCIIText";
import Link from "next/link";

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
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-[480px] flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <div className="w-full h-[270px] mb-4">
            <ASCIIText
              text="🔒"
              asciiFontSize={4}
              textFontSize={42}
              textColor="#fdf9f3"
              planeBaseHeight={12}
              enableWaves={true}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 text-center -mt-24">
          <p className="text-white/70 mb-6">
            Enter the password to view this case study.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Enter password"
              className={`w-full px-4 py-3 rounded-none bg-white/10 focus:bg-white/20 ${error
                  ? "border-red-500"
                  : "border-transparent"
                } text-white placeholder:text-white/40 outline-none transition-all duration-300 ease-in-out`}
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-sm text-center">
                Incorrect password. Please try again.
              </p>
            )}
            <button
              type="submit"
              className="w-full px-4 py-3 rounded-none bg-white text-[#0a0a0a] font-medium hover:bg-white/90 transition-colors"
            >
              Unlock
            </button>
          </form>


          <p className="text-white/40 text-sm mt-2 text-center">
            <Link href="mailto:mckeever02@gmail.com?subject=Case%20Study%20Access%20Request&body=Hi%2C%0D%0A%0D%0ACan%20you%20provide%20access%20to%20your%20case%20studies%20by%20supplying%20the%20password%3F%0D%0A%0D%0AThanks" className="text-white/70 underline underline-offset-2 hover:text-white transition-colors">Contact me</Link> if you need access.
          </p>
        </div>


      </div>
    </div>
  );
}
