import * as React from "react";

export interface FieldProps {
  id?: string;
  label: string;
  helperText?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

export function Field({
  id,
  label,
  helperText,
  error,
  className = "",
  children,
}: FieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-rose-600" id={id ? `${id}-error` : undefined}>
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-slate-500" id={id ? `${id}-help` : undefined}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`h-10 px-3 bg-white border ${
          error ? "border-rose-300" : "border-[#E5E5E5]"
        } rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C0222E] focus:ring-2 focus:ring-[#C0222E]/20 transition-colors duration-150 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${className}`.trim()}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", error, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`h-10 px-3 bg-white border ${
          error ? "border-rose-300" : "border-[#E5E5E5]"
        } rounded-md text-sm text-slate-900 focus:outline-none focus:border-[#C0222E] focus:ring-2 focus:ring-[#C0222E]/20 transition-colors duration-150 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${className}`.trim()}
        {...props}
      />
    );
  }
);

Select.displayName = "Select";
