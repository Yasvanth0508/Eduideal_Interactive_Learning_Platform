import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign In | Learnova — EDUiDEAL Academy",
  description:
    "Sign in with your register number or administrator email to access personalized learning.",
};

interface LoginPageProps {
  searchParams?: Promise<{
    next?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentUser();

  if (user && user.isActive && user.branchIsActive) {
    if (user.role === "ADMIN") {
      redirect("/admin");
    } else {
      redirect("/dashboard");
    }
  }

  const resolvedParams = searchParams ? await searchParams : {};
  const next =
    typeof resolvedParams.next === "string" ? resolvedParams.next : undefined;

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
        <LoginForm next={next} />
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-[#555555] border-t border-[#E5E5E5] bg-white">
        EDUiDEAL Academy — Learnova Digitalized Learning World &copy; 2026
      </footer>
    </div>
  );
}
