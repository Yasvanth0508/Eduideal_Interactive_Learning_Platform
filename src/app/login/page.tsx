"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, UserCheck, Key, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [registerNumber, setRegisterNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerNumber.trim() || !password.trim()) {
      setError("Please enter both Register Number and Password.");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate login verification or connect to auth endpoint
    setTimeout(() => {
      setIsLoading(false);
      // For demo / initial admin credentials
      if (registerNumber.trim() === "212224040265" && password.trim() === "htna2006") {
        router.push("/chemistry");
      } else {
        // Successful mock sign in for other registered users
        router.push("/chemistry");
      }
    }, 600);
  };

  const handleFillAdmin = () => {
    setRegisterNumber("212224040265");
    setPassword("htna2006");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-between selection:bg-[#C0222E] selection:text-white font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E5E5] shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/eduideal-logo-BUtjWTvV.png"
              alt="EDUiDEAL Academy Logo"
              className="h-8 sm:h-9 w-auto object-contain block group-hover:scale-105 transition-transform"
            />
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FAFAFA] hover:bg-slate-100 border border-[#E5E5E5] text-black text-xs font-bold transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Overview</span>
          </Link>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="max-w-md w-full mx-auto px-4 py-12">
        <div className="bg-white border border-[#E5E5E5] rounded-3xl p-8 shadow-xl shadow-slate-200/50">
          <div className="text-center mb-8 flex flex-col items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/eduideal-logo-BUtjWTvV.png"
              alt="EDUiDEAL Academy Logo"
              className="h-12 sm:h-14 w-auto object-contain mx-auto"
            />
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5">
              <span className="font-bold">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono font-bold text-black mb-1.5 uppercase tracking-wider">
                Register Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. 212224040265 or 00000001"
                  value={registerNumber}
                  onChange={(e) => setRegisterNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E5E5] text-black placeholder-[#777777] focus:outline-none focus:border-[#C0222E] focus:ring-2 focus:ring-[#C0222E]/20 transition-all font-mono text-sm shadow-xs"
                />
                <UserCheck className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-black mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E5E5] text-black placeholder-[#777777] focus:outline-none focus:border-[#C0222E] focus:ring-2 focus:ring-[#C0222E]/20 transition-all text-sm shadow-xs"
                />
                <Key className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl text-white font-extrabold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
              style={{
                background: "var(--brand)",
                boxShadow: "0 4px 14px rgba(218,67,76,0.3)",
              }}
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#E5E5E5]">
            <p className="text-xs text-[#555555] mb-3 text-center font-medium">
              Initial Administrator Credentials Helper:
            </p>
            <button
              type="button"
              onClick={handleFillAdmin}
              className="w-full py-2.5 px-3 rounded-xl bg-rose-50/60 hover:bg-rose-100/80 border border-rose-200 text-[#C0222E] text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#C0222E]" />
              <span>Fill Admin: 212224040265 / htna2006</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-[#555555] border-t border-[#E5E5E5] bg-white font-mono">
        EDUiDEAL Academy — Learnova Digitalized Learning World &copy; 2026
      </footer>
    </div>
  );
}
