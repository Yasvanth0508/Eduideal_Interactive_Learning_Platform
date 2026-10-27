import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/server/authorization/session";
import { getCreateFormData } from "@/features/students/queries";
import { PageHeader } from "@/features/students/components/page-header";
import { CreateStudentForm } from "@/features/students/components/create-student-form";

export default async function NewStudentPage() {
  const user = await requireRole("ADMIN");
  const { classes, subjects } = await getCreateFormData();

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors duration-150"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Students</span>
          </Link>
        }
        title="Add student"
        description={`Create a new student account in ${user.branchName} branch.`}
      />

      <CreateStudentForm classes={classes} subjects={subjects} />
    </div>
  );
}
