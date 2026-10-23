"use client";

import { useActionState, useId, useState } from "react";
import Link from "next/link";
import { Copy, Check, Eye, EyeOff, RefreshCw } from "lucide-react";
import { createStudent } from "@/features/admin/actions";
import { generatePassword } from "@/features/admin/lib/generate-password";
import { Button } from "./button";
import { Field, Input, Select } from "./field";
import { Card } from "./card";

interface CreateStudentFormProps {
  classes: { id: string; label: string }[];
  subjects: { id: string; classId: string; name: string }[];
}

export function CreateStudentForm({
  classes,
  subjects,
}: CreateStudentFormProps) {
  const [state, formAction, isPending] = useActionState(createStudent, null);

  const [selectedClassId, setSelectedClassId] = useState<string>(
    classes[0]?.id || ""
  );
  const [password, setPassword] = useState<string>(() => generatePassword());
  const [showPassword, setShowPassword] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const nameId = useId();
  const emailId = useId();
  const regId = useId();
  const classSelectId = useId();
  const passwordId = useId();

  const filteredSubjects = subjects.filter(
    (s) => s.classId === selectedClassId
  );

  async function handleCopy(fieldKey: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldKey);
      setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  }

  // Success view
  if (state?.ok && state.credentials) {
    return (
      <Card className="max-w-xl mx-auto space-y-6">
        <div className="border-b border-[#E5E5E5] pb-4">
          <h2 className="text-base font-semibold text-slate-900">
            Student created
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            The student account has been registered successfully.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-[#E5E5E5] rounded-md">
            <div>
              <div className="text-xs text-slate-500">Name</div>
              <div className="text-sm font-medium text-slate-900">
                {state.credentials.name}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopy("name", state.credentials!.name)}
              className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md text-xs font-medium text-slate-700 bg-white border border-[#E5E5E5] hover:bg-slate-100 transition-colors duration-150 cursor-pointer"
            >
              {copiedField === "name" ? (
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

          <div className="flex items-center justify-between p-3 bg-slate-50 border border-[#E5E5E5] rounded-md">
            <div>
              <div className="text-xs text-slate-500">Register number</div>
              <div className="text-sm font-medium text-slate-900 tabular-nums">
                {state.credentials.registerNumber}
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                handleCopy("reg", state.credentials!.registerNumber)
              }
              className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md text-xs font-medium text-slate-700 bg-white border border-[#E5E5E5] hover:bg-slate-100 transition-colors duration-150 cursor-pointer"
            >
              {copiedField === "reg" ? (
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

          <div className="flex items-center justify-between p-3 bg-slate-50 border border-[#E5E5E5] rounded-md">
            <div>
              <div className="text-xs text-slate-500">Temporary password</div>
              <div className="text-sm font-medium text-slate-900">
                {state.credentials.password}
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                handleCopy("pass", state.credentials!.password)
              }
              className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md text-xs font-medium text-slate-700 bg-white border border-[#E5E5E5] hover:bg-slate-100 transition-colors duration-150 cursor-pointer"
            >
              {copiedField === "pass" ? (
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

          <p className="text-xs text-slate-500 bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-900">
            This password is shown only once. Please share it with the student.
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#E5E5E5]">
          <Link
            href="/admin"
            className="inline-flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium text-slate-700 bg-white border border-[#E5E5E5] hover:bg-slate-50 transition-colors duration-150"
          >
            Back to students
          </Link>
          <button
            type="button"
            onClick={() => {
              window.location.reload();
            }}
            className="inline-flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium bg-[#C0222E] text-white hover:bg-[#a61a24] transition-colors duration-150 cursor-pointer"
          >
            Add another
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      {state?.error && (
        <div
          role="alert"
          className="mb-6 p-3 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium"
        >
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-5">
        <Field
          id={nameId}
          label="Full name"
          error={state?.fieldErrors?.name?.[0]}
        >
          <Input
            id={nameId}
            name="name"
            placeholder="e.g. Rahul Sharma"
            required
            error={!!state?.fieldErrors?.name}
          />
        </Field>

        <Field
          id={emailId}
          label="Email address"
          helperText="Used for account notifications and password reset."
          error={state?.fieldErrors?.email?.[0]}
        >
          <Input
            id={emailId}
            type="email"
            name="email"
            placeholder="student@example.com"
            required
            error={!!state?.fieldErrors?.email}
          />
        </Field>

        <Field
          id={regId}
          label="Register number"
          helperText="3 to 30 characters (letters, numbers, '-' and '_' only)."
          error={state?.fieldErrors?.registerNumber?.[0]}
        >
          <Input
            id={regId}
            name="registerNumber"
            placeholder="e.g. STU-2026-001"
            required
            className="tabular-nums"
            error={!!state?.fieldErrors?.registerNumber}
          />
        </Field>

        <Field
          id={classSelectId}
          label="Class"
          error={state?.fieldErrors?.classId?.[0]}
        >
          <Select
            id={classSelectId}
            name="classId"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            required
            error={!!state?.fieldErrors?.classId}
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          id={passwordId}
          label="Password"
          helperText="At least 8 characters. You can use the generated password."
          error={state?.fieldErrors?.password?.[0]}
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id={passwordId}
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              onClick={() => setPassword(generatePassword())}
              className="gap-1.5 whitespace-nowrap"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Generate</span>
            </Button>
          </div>
        </Field>

        {/* Subjects Checklist for the selected class */}
        <div className="pt-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Subject access
          </label>
          {filteredSubjects.length === 0 ? (
            <p className="text-xs text-slate-500 py-3 px-3 bg-slate-50 border border-[#E5E5E5] rounded-md">
              No published subjects available for this class.
            </p>
          ) : (
            <div className="space-y-2 border border-[#E5E5E5] rounded-md p-3 bg-slate-50/50">
              {filteredSubjects.map((subject) => (
                <label
                  key={subject.id}
                  className="flex items-center gap-2.5 text-sm text-slate-800 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    name="subjectIds"
                    value={subject.id}
                    defaultChecked
                    className="w-4 h-4 rounded border-[#E5E5E5] text-[#C0222E] focus:ring-[#C0222E]/20"
                  />
                  <span>{subject.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E5E5]">
          <Link
            href="/admin"
            className="inline-flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium text-slate-700 bg-white border border-[#E5E5E5] hover:bg-slate-50 transition-colors duration-150"
          >
            Cancel
          </Link>
          <Button
            type="submit"
            variant="primary"
            isPending={isPending}
            pendingText="Creating student..."
          >
            Create student
          </Button>
        </div>
      </form>
    </Card>
  );
}
