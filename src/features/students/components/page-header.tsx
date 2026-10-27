import * as React from "react";

export interface PageHeaderProps {
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  action,
  breadcrumbs,
  className = "",
}: PageHeaderProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 ${className}`.trim()}
    >
      <div>
        {breadcrumbs && <div className="mb-2">{breadcrumbs}</div>}
        <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        {description && (
          <div className="text-sm text-slate-500 mt-1">{description}</div>
        )}
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
}
