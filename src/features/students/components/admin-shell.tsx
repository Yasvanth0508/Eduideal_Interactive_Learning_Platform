"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AdminSidebar } from "./admin-sidebar";

export interface AdminShellProps {
  adminName: string;
  branchName: string;
  children: React.ReactNode;
}

export function AdminShell({
  adminName,
  branchName,
  children,
}: AdminShellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);
  const prevPathnameRef = useRef(pathname);

  // 1. Close drawer automatically when route changes
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      setIsOpen(false);
    }
  }, [pathname]);

  // 2. Lock body scroll while drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // 3. Close on Escape and focus management
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
      // Focus close button inside drawer when opened
      closeButtonRef.current?.focus();
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false;
      // Return focus to menu button when closed
      menuButtonRef.current?.focus();
    }
  }, [isOpen]);

  // 4. Auto-close if screen expands to lg (1024px) or larger
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    function handleMediaChange(e: MediaQueryListEvent | MediaQueryList) {
      if (e.matches) {
        setIsOpen(false);
      }
    }

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans antialiased selection:bg-[#C0222E] selection:text-white">
      {/* Desktop Fixed Sidebar (width 240px = w-60) */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-30 w-60 bg-white border-r border-[#E5E5E5] h-screen">
        <AdminSidebar adminName={adminName} branchName={branchName} />
      </aside>

      {/* Mobile/Tablet Sticky Top Bar (height 56px = h-14) */}
      <header className="sticky top-0 z-30 h-14 bg-white border-b border-[#E5E5E5] px-4 flex items-center gap-3 lg:hidden">
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-10 h-10 -ml-2 rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0222E]/40"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <Link
          href="/admin"
          className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0222E]/40 rounded-md"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/eduideal-logo-BUtjWTvV.png"
            alt="EDUiDEAL Academy Logo"
            className="h-8 w-auto object-contain block"
          />
        </Link>
      </header>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-200 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className={`fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] bg-white border-r border-[#E5E5E5] shadow-lg transform transition-transform duration-200 ease-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
        }`}
      >
        <AdminSidebar
          adminName={adminName}
          branchName={branchName}
          onNavigate={() => setIsOpen(false)}
          headerAction={
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center w-10 h-10 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0222E]/40"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          }
        />
      </div>

      {/* Main Area Offset by 240px (lg:pl-60) */}
      <div className="lg:pl-60 flex flex-col min-h-screen min-w-0">
        <main className="flex-1 bg-[#FAFAFA] min-w-0">
          <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
            {children}
          </div>
        </main>

        <footer className="py-4 text-center text-xs text-slate-500 border-t border-[#E5E5E5] bg-white shrink-0">
          EDUiDEAL Academy - Learnova 2026
        </footer>
      </div>
    </div>
  );
}
