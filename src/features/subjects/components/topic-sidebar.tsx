"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Search,
  Menu,
  X,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { TopicListItem } from "../types";

interface TopicSidebarProps {
  subjectSlug: string;
  chapterSlug: string;
  currentTopicSlug: string;
  chapterName: string;
  subjectName: string;
  topics: TopicListItem[];
}

export function TopicSidebar({
  subjectSlug,
  chapterSlug,
  currentTopicSlug,
  chapterName,
  subjectName,
  topics,
}: TopicSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const filteredTopics = topics.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentIndex = topics.findIndex((t) => t.slug === currentTopicSlug);
  const progressPercent =
    topics.length > 0
      ? Math.round(((currentIndex + 1) / topics.length) * 100)
      : 0;

  return (
    <>
      {/* Mobile Sidebar Toggle Button */}
      <div className="lg:hidden sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E5E5] px-4 py-2.5 flex items-center justify-between">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="flex items-center gap-2 text-xs font-semibold text-black bg-[#FAFAFA] hover:bg-slate-100 px-3 py-2 rounded-xl border border-[#E5E5E5] transition-all"
        >
          {isMobileOpen ? (
            <X className="w-4 h-4 text-[#C0222E]" />
          ) : (
            <Menu className="w-4 h-4 text-[#C0222E]" />
          )}
          <span>
            Topics List ({currentIndex + 1}/{topics.length})
          </span>
        </button>

        <span className="text-xs font-mono font-bold text-[#555555]">
          {progressPercent}% Complete
        </span>
      </div>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed lg:sticky top-16 z-40 h-[calc(100vh-4rem)] bg-white border-r border-[#E5E5E5] flex flex-col transition-all duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0 w-80 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-16" : "lg:w-80"}
          left-0
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-[#E5E5E5] flex items-center justify-between gap-2">
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#555555] uppercase tracking-wider truncate">
                <BookOpen className="w-3.5 h-3.5 text-[#C0222E] flex-shrink-0" />
                <span className="truncate">{subjectName}</span>
              </div>
              <h2 className="text-sm font-black text-black truncate mt-0.5">
                {chapterName}
              </h2>
            </div>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-black hover:bg-[#FAFAFA] border border-transparent hover:border-[#E5E5E5] transition-all cursor-pointer"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-[#C0222E]" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-[#555555]" />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-black hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar (Expanded Only) */}
        {!isCollapsed && (
          <div className="px-4 py-3 bg-[#FAFAFA] border-b border-[#E5E5E5]">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#555555] mb-1.5">
              <span>Chapter Progress</span>
              <span className="font-mono text-[#C0222E]">
                {currentIndex + 1} of {topics.length} topics
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${progressPercent}%`,
                  background: "var(--brand)",
                }}
              />
            </div>
          </div>
        )}

        {/* Search Input (Expanded Only) */}
        {!isCollapsed && (
          <div className="p-3 border-b border-[#E5E5E5]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-black placeholder:text-slate-400 focus:outline-none focus:border-[#C0222E] transition-colors"
              />
            </div>
          </div>
        )}

        {/* Topic List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
          {filteredTopics.map((t, idx) => {
            const formattedNum = String(t.displayOrder).padStart(2, "0");
            const isActive = t.slug === currentTopicSlug;
            const isCompleted = idx < currentIndex;

            return (
              <Link
                key={t.id}
                href={`/${subjectSlug}/${chapterSlug}/${t.slug}`}
                onClick={() => setIsMobileOpen(false)}
                title={isCollapsed ? `${formattedNum}. ${t.name}` : undefined}
                className={`
                  group relative flex items-center gap-3 p-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer
                  ${
                    isActive
                      ? "bg-[#C0222E]/10 text-[#C0222E] border border-[#C0222E]/30 font-bold shadow-2xs"
                      : "text-slate-700 hover:bg-[#FAFAFA] hover:text-black border border-transparent"
                  }
                  ${isCollapsed ? "justify-center px-0" : ""}
                `}
              >
                {/* Topic Index Number Badge */}
                <span
                  className={`
                    w-7 h-7 rounded-lg flex items-center justify-center font-mono text-[11px] font-bold flex-shrink-0 transition-colors
                    ${
                      isActive
                        ? "bg-[#C0222E] text-white"
                        : isCompleted
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-[#FAFAFA] text-[#555555] border border-[#E5E5E5] group-hover:border-[#C0222E]/30"
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    formattedNum
                  )}
                </span>

                {/* Topic Name & Info (Expanded Only) */}
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p
                      className={`truncate leading-snug ${
                        isActive ? "text-[#C0222E] font-extrabold" : "text-slate-800"
                      }`}
                    >
                      {t.name}
                    </p>
                    {t.description && (
                      <p className="text-[10px] text-[#555555] truncate mt-0.5 font-normal">
                        {t.description}
                      </p>
                    )}
                  </div>
                )}

                {/* Active Indicator Bar */}
                {isActive && !isCollapsed && (
                  <div className="w-1.5 h-4 bg-[#C0222E] rounded-full flex-shrink-0" />
                )}
              </Link>
            );
          })}

          {filteredTopics.length === 0 && !isCollapsed && (
            <div className="p-4 text-center text-xs text-[#555555]">
              No topics found matching &quot;{searchQuery}&quot;
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        {!isCollapsed && (
          <div className="p-3 border-t border-[#E5E5E5] bg-[#FAFAFA] flex items-center justify-between text-[11px] text-[#555555]">
            <Link
              href={`/${subjectSlug}/${chapterSlug}`}
              className="hover:text-black transition-colors font-medium flex items-center gap-1"
            >
              <Layers className="w-3.5 h-3.5 text-[#C0222E]" />
              <span>Chapter Overview</span>
            </Link>
            <span className="font-mono text-[10px]">{topics.length} Topics</span>
          </div>
        )}
      </aside>
    </>
  );
}
