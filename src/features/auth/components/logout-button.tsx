import { LogOut } from "lucide-react";
import { logoutAction } from "@/features/auth/actions";

interface LogoutButtonProps {
  className?: string;
}

export function LogoutButton({ className }: LogoutButtonProps) {
  return (
    <form action={logoutAction} className="inline-block">
      <button
        type="submit"
        className={
          className ||
          "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer active:scale-95 shadow-xs"
        }
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Log Out</span>
      </button>
    </form>
  );
}
