"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteStudent } from "@/features/students/actions";
import { Button } from "./button";
import { Field, Input } from "./field";

interface StudentDeleteFormProps {
  studentId: string;
  expectedRegisterNumber: string;
}

export function StudentDeleteForm({
  studentId,
  expectedRegisterNumber,
}: StudentDeleteFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(deleteStudent, null);
  const [inputVal, setInputVal] = useState("");
  const inputId = useId();

  const isMatched = inputVal.trim() === expectedRegisterNumber.trim();

  useEffect(() => {
    if (state?.ok) {
      router.push("/admin");
    }
  }, [state?.ok, router]);

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

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="studentId" value={studentId} />

        <Field
          id={inputId}
          label="Confirmation"
          helperText={`Type "${expectedRegisterNumber}" to confirm permanent deletion.`}
          error={state?.fieldErrors?.confirmRegisterNumber?.[0]}
        >
          <Input
            id={inputId}
            name="confirmRegisterNumber"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={expectedRegisterNumber}
            required
            className="tabular-nums"
          />
        </Field>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="danger"
            disabled={!isMatched || isPending}
            isPending={isPending}
            pendingText="Deleting student..."
          >
            Delete student
          </Button>
        </div>
      </form>
    </div>
  );
}
