"use client";

import { useActionState, useId, useState } from "react";
import { Check, Copy, Eye, EyeOff, RefreshCw } from "lucide-react";
import { resetPassword } from "@/features/students/actions";
import { generatePassword } from "@/features/students/lib/generate-password";
import { Button } from "./button";
import { Field, Input } from "./field";

interface StudentPasswordFormProps {
  studentId: string;
}

export function StudentPasswordForm({ studentId }: StudentPasswordFormProps) {
  const [state, formAction, isPending] = useActionState(resetPassword, null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const passwordId = useId();

  async function handleCopy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  }

  return (
    <div className="space-y-4">
      {state?.error && (
        <div
          role="alert"
          className="p-3 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium"
        >
          {state.error}
        </div>
      )}

      {state?.ok && state.password && !dismissed && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-900">
              Password reset successfully
            </span>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              Dismiss
            </button>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-white border border-emerald-200 rounded-md">
            <div>
              <div className="text-[11px] text-slate-500">New password</div>
              <div className="text-sm font-medium text-slate-900">
                {state.password}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(state.password!)}
              className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md text-xs font-medium text-slate-700 bg-white border border-[#E5E5E5] hover:bg-slate-50 transition-colors duration-150 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-emerald-800">
            This password is shown only once. Please share it with the student.
          </p>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="studentId" value={studentId} />

        <Field
          id={passwordId}
          label="New password"
          helperText="Minimum 8 characters. You may generate a strong temporary password."
          error={state?.fieldErrors?.password?.[0]}
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id={passwordId}
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (dismissed) setDismissed(false);
                }}
                placeholder="Enter or generate new password"
                required
                className="pr-10"
                error={!!state?.fieldErrors?.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 transition-colors duration-150 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                const nextPass = generatePassword();
                setPassword(nextPass);
                setShowPassword(true);
                if (dismissed) setDismissed(false);
              }}
              className="gap-1.5 whitespace-nowrap"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Generate</span>
            </Button>
          </div>
        </Field>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="secondary"
            isPending={isPending}
            pendingText="Resetting..."
          >
            Reset password
          </Button>
        </div>
      </form>
    </div>
  );
}
