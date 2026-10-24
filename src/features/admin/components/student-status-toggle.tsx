"use client";

import { useTransition } from "react";
import { setStudentActive } from "@/features/admin/actions";
import { Button } from "./button";

interface StudentStatusToggleProps {
  studentId: string;
  isActive: boolean;
}

export function StudentStatusToggle({
  studentId,
  isActive,
}: StudentStatusToggleProps) {
  const [isPending, startTransition] = useTransition();

  async function handleToggle() {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("studentId", studentId);
      formData.set("active", String(!isActive));
      await setStudentActive(formData);
    });
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-[#E5E5E5]">
      <div>
        <div className="text-sm font-medium text-slate-900">
          Account status: {isActive ? "Active" : "Deactivated"}
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          A deactivated student cannot sign in.
        </p>
      </div>

      <Button
        type="button"
        variant={isActive ? "outline-danger" : "secondary"}
        onClick={handleToggle}
        disabled={isPending}
      >
        {isPending
          ? "Updating..."
          : isActive
          ? "Deactivate student"
          : "Activate student"}
      </Button>
    </div>
  );
}
