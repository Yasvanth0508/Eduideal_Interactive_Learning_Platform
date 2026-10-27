import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline-danger";
  isPending?: boolean;
  pendingText?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "secondary",
      isPending = false,
      pendingText,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    let variantStyles = "";

    switch (variant) {
      case "primary":
        variantStyles =
          "bg-[#C0222E] text-white hover:bg-[#a61a24] active:bg-[#91161f] focus-visible:ring-[#C0222E]/20";
        break;
      case "danger":
        variantStyles =
          "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 focus-visible:ring-rose-500/20";
        break;
      case "outline-danger":
        variantStyles =
          "bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 active:bg-rose-100 focus-visible:ring-rose-500/20";
        break;
      case "secondary":
      default:
        variantStyles =
          "bg-white border border-[#E5E5E5] text-slate-700 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100 focus-visible:ring-slate-400/20";
        break;
    }

    const baseStyles =
      "inline-flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2";

    return (
      <button
        ref={ref}
        disabled={disabled || isPending}
        className={`${baseStyles} ${variantStyles} ${className}`.trim()}
        {...props}
      >
        {isPending ? pendingText || "Saving..." : children}
      </button>
    );
  }
);

Button.displayName = "Button";
