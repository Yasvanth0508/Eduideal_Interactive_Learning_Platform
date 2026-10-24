"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { ADMIN_NAV_ITEMS } from "./admin-nav";

export interface AdminSidebarProps {
  adminName: string;
  branchName: string;
  onNavigate?: () => void;
  headerAction?: React.ReactNode;
}

export function AdminSidebar({
  adminName,
  branchName,
  onNavigate,
  headerAction,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Top: Logo & optional header action (e.g. mobile drawer close button) */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-[#E5E5E5] shrink-0">
        <Link
          href="/admin"
          onClick={onNavigate}
          className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0222E]/40 rounded-md"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/eduideal-logo-BUtjWTvV.png"
            alt="EDUiDEAL Academy Logo"
            className="h-8 w-auto object-contain block"
          />
        </Link>
        {headerAction && <div>{headerAction}</div>}
      </div>

      {/* Middle: Navigation List */}
      <nav
        className="flex-1 p-3 space-y-1 overflow-y-auto"
        aria-label="Admin navigation"
      >
        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive =
            item.match === "prefix"
              ? pathname === item.href || pathname.startsWith(item.href + "/")
              : pathname === item.href;

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center h-10 px-3 gap-3 rounded-md text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0222E]/40 ${
                isActive
                  ? "text-[#C0222E]"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
              style={
                isActive
                  ? {
                      backgroundColor: "var(--brand-tint)",
                    }
                  : undefined
              }
            >
              <Icon size={18} className="shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: User details & full-width logout button */}
      <div className="p-4 border-t border-[#E5E5E5] space-y-3 shrink-0">
        <div className="min-w-0">
          <div
            className="text-sm font-medium text-slate-900 truncate"
            title={adminName}
          >
            {adminName}
          </div>
          <div
            className="text-xs text-slate-500 truncate mt-0.5"
            title={`${branchName} branch`}
          >
            {branchName} branch
          </div>
        </div>

        <div className="w-full [&>form]:block [&>form]:w-full">
          <LogoutButton className="w-full inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-md text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 hover:text-slate-900 border border-[#E5E5E5] transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0222E]/40" />
        </div>
      </div>
    </div>
  );
}
