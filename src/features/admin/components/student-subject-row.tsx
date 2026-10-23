"use client";

import { useTransition } from "react";
import { grantSubject, revokeSubject } from "@/features/admin/actions";
import { Button } from "./button";

interface StudentSubjectRowProps {
  studentId: string;
  subjectId: string;
  name: string;
  isGranted: boolean;
  assignedAt: Date | null;
  revokedAt: Date | null;
}

function formatDate(date: Date | null | undefined): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function StudentSubjectRow({
  studentId,
  subjectId,
  name,
  isGranted,
  assignedAt,
  revokedAt,
}: StudentSubjectRowProps) {
  const [isPending, startTransition] = useTransition();

  async function handleToggle() {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("studentId", studentId);
      formData.set("subjectId", subjectId);

      if (isGranted) {
        await revokeSubject(formData);
      } else {
        await grantSubject(formData);
      }
    });
  }

  let dateLabel = "—";
  if (isGranted && assignedAt) {
    dateLabel = `Granted on ${formatDate(assignedAt)}`;
  } else if (!isGranted && revokedAt) {
    dateLabel = `Revoked on ${formatDate(revokedAt)}`;
  }

  return (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-slate-50/50 transition-colors duration-150 border-b border-[#E5E5E5] last:border-b-0">
      <div className="flex-1 min-w-0 pr-4">
        <div className="text-sm font-medium text-slate-900 truncate">
          {name}
        </div>
        <div className="text-xs text-slate-500 mt-0.5">{dateLabel}</div>
      </div>

      <div className="flex items-center gap-4">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${
            isGranted
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-slate-100 text-slate-600 border-slate-200"
          }`}
        >
          {isGranted ? "Granted" : "Not granted"}
        </span>

        <Button
          type="button"
          onClick={handleToggle}
          disabled={isPending}
          variant={isGranted ? "outline-danger" : "secondary"}
          className="h-8 px-3 text-xs"
        >
          {isPending ? "Updating..." : isGranted ? "Revoke" : "Grant"}
        </Button>
      </div>
    </div>
  );
}
