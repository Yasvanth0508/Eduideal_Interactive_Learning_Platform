import type { LucideIcon } from "lucide-react";
import { Users } from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  match: "exact" | "prefix";
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    label: "Students",
    href: "/admin",
    icon: Users,
    match: "prefix",
  },
];
