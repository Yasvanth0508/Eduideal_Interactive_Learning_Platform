import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/features/admin/components/card";

export default function StudentNotFound() {
  return (
    <div className="py-12 max-w-md mx-auto">
      <Card className="text-center py-8">
        <h2 className="text-base font-semibold text-slate-900 mb-2">
          Student not found.
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          The requested student does not exist or does not belong to your branch.
        </p>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md text-sm font-medium text-slate-700 bg-white border border-[#E5E5E5] hover:bg-slate-50 transition-colors duration-150"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to students</span>
        </Link>
      </Card>
    </div>
  );
}
