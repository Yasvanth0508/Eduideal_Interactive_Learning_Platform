"use client";

import { useActionState, useId } from "react";
import { updateStudent } from "@/features/admin/actions";
import { Button } from "./button";
import { Field, Input } from "./field";

interface StudentProfileFormProps {
  studentId: string;
  initialName: string;
  initialRegisterNumber: string | null;
  email: string;
  classLabel: string;
}

export function StudentProfileForm({
  studentId,
  initialName,
  initialRegisterNumber,
  email,
  classLabel,
}: StudentProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateStudent, null);
  const nameId = useId();
  const regId = useId();

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="studentId" value={studentId} />

      {state?.error && (
        <div
          role="alert"
          className="p-3 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium"
        >
          {state.error}
        </div>
      )}

      {state?.ok && (
        <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
          Profile changes saved.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          id={nameId}
          label="Full name"
          error={state?.fieldErrors?.name?.[0]}
        >
          <Input
            id={nameId}
            name="name"
            defaultValue={initialName}
            required
            error={!!state?.fieldErrors?.name}
          />
        </Field>

        <Field
          id={regId}
          label="Register number"
          helperText="Letters, digits, '-' and '_' only."
          error={state?.fieldErrors?.registerNumber?.[0]}
        >
          <Input
            id={regId}
            name="registerNumber"
            defaultValue={initialRegisterNumber || ""}
            required
            className="tabular-nums"
            error={!!state?.fieldErrors?.registerNumber}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <div className="h-10 px-3 flex items-center bg-slate-50 border border-[#E5E5E5] rounded-md text-sm text-slate-500">
            {email}
          </div>
          <p className="text-xs text-slate-400">
            Email address cannot be modified here.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-700">Class</span>
          <div className="h-10 px-3 flex items-center bg-slate-50 border border-[#E5E5E5] rounded-md text-sm text-slate-500">
            {classLabel}
          </div>
          <p className="text-xs text-slate-400">
            Class assignments cannot be modified here.
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-3">
        <Button
          type="submit"
          variant="primary"
          isPending={isPending}
          pendingText="Saving..."
        >
          Save profile
        </Button>
      </div>
    </form>
  );
}
