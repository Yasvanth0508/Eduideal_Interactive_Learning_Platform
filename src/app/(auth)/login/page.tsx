import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/server/authorization/session";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign In | Learnova — EDUiDEAL Academy",
  description:
    "Sign in with your register number or administrator email to access personalized learning.",
};

export const dynamic = "force-dynamic";

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
    <div className="flex min-h-screen flex-col bg-neutral-100 font-sans text-neutral-900 antialiased selection:bg-[var(--brand)] selection:text-white">
      {/* Header */}
      <header className="bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/eduideal-logo-BUtjWTvV.png"
              alt="EDUiDEAL Academy Logo"
              className="block h-8 w-auto object-contain sm:h-9"
            />
          </Link>

          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-xl bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200 hover:text-neutral-900"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Overview</span>
          </Link>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="mx-auto flex w-full max-w-md flex-1 items-center px-4 py-12">
        <div className="w-full">
          <LoginForm next={next} />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-neutral-500">
        EDUiDEAL Academy — Learnova Digitalized Learning World &copy; 2026
      </footer>
    </div>
  );
}
