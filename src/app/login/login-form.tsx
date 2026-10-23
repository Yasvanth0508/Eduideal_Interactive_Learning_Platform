"use client";

import { useActionState, useState } from "react";
import { ArrowRight, UserCheck, Eye, EyeOff } from "lucide-react";
import { loginAction } from "@/features/auth/actions";

interface LoginFormProps {
  next?: string;
}

export function LoginForm({ next }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-3xl p-8 shadow-xl shadow-slate-200/50">
      <div className="text-center mb-8 flex flex-col items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/eduideal-logo-BUtjWTvV.png"
          alt="EDUiDEAL Academy Logo"
          className="h-12 sm:h-14 w-auto object-contain mx-auto"
        />
      </div>

      {state?.error && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5"
        >
          <span className="font-bold">⚠️</span>
          <span>{state.error}</span>
        </div>
      )}

      <form action={formAction} className="space-y-5">
        {next && <input type="hidden" name="next" value={next} />}

        <div>
          <label className="block text-sm font-medium text-black mb-1.5">
            Register number or email
          </label>
          <div className="relative">
            <input
              type="text"
              name="identifier"
              required
              autoComplete="username"
              placeholder="Register number (students) or email (staff)"
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E5E5] text-black placeholder-[#777777] focus:outline-none focus:border-[#C0222E] focus:ring-2 focus:ring-[#C0222E]/20 transition-all text-sm shadow-xs"
            />
            <UserCheck className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full px-4 py-3 pr-11 rounded-xl bg-white border border-[#E5E5E5] text-black placeholder-[#777777] focus:outline-none focus:border-[#C0222E] focus:ring-2 focus:ring-[#C0222E]/20 transition-all text-sm shadow-xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3.5 rounded-xl text-white font-extrabold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
          style={{
            background: "var(--brand)",
            boxShadow: "0 4px 14px rgba(218,67,76,0.3)",
          }}
        >
          {isPending ? (
            <span>Signing in...</span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-[#555555]">
        Forgot your password? Please contact your branch admin.
      </p>
    </div>
  );
}
