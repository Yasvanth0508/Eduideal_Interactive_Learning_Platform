import Link from "next/link";
import { Search } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { listStudents } from "@/features/admin/queries";
import { PageHeader } from "@/features/admin/components/page-header";
import { StatusBadge } from "@/features/admin/components/status-badge";
import { EmptyState } from "@/features/admin/components/empty-state";

interface AdminPageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const user = await requireRole("ADMIN");
  const params = await searchParams;

  const q = typeof params.q === "string" ? params.q.trim() : "";
  const rawStatus = typeof params.status === "string" ? params.status : "all";
  const status =
    rawStatus === "active" || rawStatus === "inactive" ? rawStatus : "all";
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);

  const { rows, totalCount, pageSize, totalPages } = await listStudents({
    branchId: user.branchId,
    q,
    status,
    page,
  });

  const studentWord = totalCount === 1 ? "student" : "students";
  const startItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalCount);

  function buildQueryString(targetPage: number) {
    const qp = new URLSearchParams();
    if (q) qp.set("q", q);
    if (status !== "all") qp.set("status", status);
    if (targetPage > 1) qp.set("page", targetPage.toString());
    const str = qp.toString();
    return str ? `?${str}` : "";
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description={`${user.branchName} branch - ${totalCount} ${studentWord}`}
        action={
          <Link
            href="/admin/students/new"
            className="inline-flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium bg-[#C0222E] text-white hover:bg-[#a61a24] active:bg-[#91161f] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0222E]/20"
          >
            Add student
          </Link>
        }
      />

      {/* Filter and Search Form */}
      <form
        method="GET"
        action="/admin"
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
      >
        <div className="relative flex-1">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search by name, register number or email"
            className="w-full h-10 pl-9 pr-3 bg-white border border-[#E5E5E5] rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C0222E] focus:ring-2 focus:ring-[#C0222E]/20 transition-colors duration-150"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
        </div>

        <div className="flex items-center gap-3">
          <select
            name="status"
            defaultValue={status}
            className="h-10 px-3 bg-white border border-[#E5E5E5] rounded-md text-sm text-slate-900 focus:outline-none focus:border-[#C0222E] focus:ring-2 focus:ring-[#C0222E]/20 transition-colors duration-150 cursor-pointer"
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            type="submit"
            className="h-10 px-4 rounded-md text-sm font-medium bg-white border border-[#E5E5E5] text-slate-700 hover:bg-slate-50 transition-colors duration-150 cursor-pointer"
          >
            Filter
          </button>

          {(q || status !== "all") && (
            <Link
              href="/admin"
              className="h-10 px-3 flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors duration-150"
            >
              Clear
            </Link>
          )}
        </div>
      </form>

      {/* Students Table or Empty State */}
      {rows.length === 0 ? (
        <EmptyState
          message="No students found."
          action={
            q || status !== "all" ? (
              <Link
                href="/admin"
                className="text-xs font-medium text-slate-600 hover:text-slate-900 underline"
              >
                Clear filters
              </Link>
            ) : (
              <Link
                href="/admin/students/new"
                className="inline-flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium bg-[#C0222E] text-white hover:bg-[#a61a24] transition-colors duration-150"
              >
                Add student
              </Link>
            )
          }
        />
      ) : (
        <div className="bg-white border border-[#E5E5E5] rounded-lg shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E5E5] bg-slate-50/50">
                  <th className="py-3 px-4 text-xs font-medium text-slate-500">
                    Register number
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-slate-500">
                    Name
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-slate-500">
                    Email
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-slate-500">
                    Subjects
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-slate-500">
                    Status
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-slate-500 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5] text-sm">
                {rows.map((student) => (
                  <tr
                    key={student.id}
                    className="h-12 hover:bg-slate-50/50 transition-colors duration-150"
                  >
                    <td className="py-2.5 px-4 font-medium text-slate-900 tabular-nums">
                      {student.registerNumber || "—"}
                    </td>
                    <td className="py-2.5 px-4 text-slate-900">
                      {student.name}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600">
                      {student.email}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 max-w-xs truncate">
                      {student.activeSubjectNames.length > 0
                        ? student.activeSubjectNames.join(", ")
                        : "None"}
                    </td>
                    <td className="py-2.5 px-4">
                      <StatusBadge active={student.isActive} />
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <Link
                        href={`/admin/students/${student.id}`}
                        className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-150"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-[#E5E5E5] text-xs text-slate-500">
            <div>
              Showing {startItem}-{endItem} of {totalCount}
            </div>

            <div className="flex items-center gap-2">
              {page <= 1 ? (
                <span className="inline-flex items-center justify-center h-8 px-3 rounded-md border border-[#E5E5E5] text-slate-300 cursor-not-allowed">
                  Previous
                </span>
              ) : (
                <Link
                  href={`/admin${buildQueryString(page - 1)}`}
                  className="inline-flex items-center justify-center h-8 px-3 rounded-md border border-[#E5E5E5] text-slate-700 hover:bg-slate-50 transition-colors duration-150"
                >
                  Previous
                </Link>
              )}

              {page >= totalPages ? (
                <span className="inline-flex items-center justify-center h-8 px-3 rounded-md border border-[#E5E5E5] text-slate-300 cursor-not-allowed">
                  Next
                </span>
              ) : (
                <Link
                  href={`/admin${buildQueryString(page + 1)}`}
                  className="inline-flex items-center justify-center h-8 px-3 rounded-md border border-[#E5E5E5] text-slate-700 hover:bg-slate-50 transition-colors duration-150"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
