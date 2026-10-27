"use client";

import { useActionState, useState } from "react";
import { ArrowRight, UserCheck, Eye, EyeOff } from "lucide-react";
import { loginAction } from "@/features/auth/actions";

interface LoginFormProps {
  next?: string;
}

const inputClass =
  "w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors hover:border-neutral-400 focus:border-[var(--brand)] focus:outline-none focus:ring-1 focus:ring-[var(--brand)]";

export function LoginForm({ next }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="rounded-3xl bg-white p-8 sm:p-10">
      <div className="mb-10 flex flex-col items-center justify-center text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/eduideal-logo-BUtjWTvV.png"
          alt="EDUiDEAL Academy Logo"
          className="mx-auto h-12 w-auto object-contain sm:h-14"
        />
      </div>

      {state?.error && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-2.5 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
        >
          <span>⚠️</span>
          <span>{state.error}</span>
        </div>
      )}

      <form action={formAction} className="space-y-5">
        {next && <input type="hidden" name="next" value={next} />}

        <div>
          <label
            htmlFor="identifier"
            className="mb-2 block text-sm font-medium text-neutral-900"
          >
            Register number or email
          </label>
          <div className="relative">
            <input
              id="identifier"
              type="text"
              name="identifier"
              required
              autoComplete="username"
              placeholder="Register number or email"
              className={`${inputClass} pr-11`}
            />
            <UserCheck className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-neutral-900"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className={`${inputClass} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-400 transition-colors hover:text-neutral-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="group mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--brand)] py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <span>Signing in...</span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-xs text-neutral-500">
        Forgot your password? Please contact your branch admin.
      </p>
    </div>
  );
}