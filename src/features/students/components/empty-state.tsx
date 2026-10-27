import * as React from "react";

export interface EmptyStateProps {
  message?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  message = "No students found.",
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`py-12 px-4 text-center flex flex-col items-center justify-center gap-3 bg-white border border-[#E5E5E5] rounded-lg ${className}`.trim()}
    >
      <p className="text-sm text-slate-500">{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
