import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/server/authorization/session";
import { getStudentDetail } from "@/features/students/queries";
import { PageHeader } from "@/features/students/components/page-header";
import { StatusBadge } from "@/features/students/components/status-badge";
import { Card, CardHeader } from "@/features/students/components/card";
import { StudentProfileForm } from "@/features/students/components/student-profile-form";
import { StudentSubjectRow } from "@/features/students/components/student-subject-row";
import { StudentPasswordForm } from "@/features/students/components/student-password-form";
import { StudentStatusToggle } from "@/features/students/components/student-status-toggle";
import { StudentDeleteForm } from "@/features/students/components/student-delete-form";

interface StudentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudentDetailPage({
  params,
}: StudentDetailPageProps) {
  const user = await requireRole("ADMIN");
  const { id } = await params;

  const student = await getStudentDetail(user.branchId, id);

  if (!student) {
    notFound();
  }

  const classLabel = student.boardName
    ? `${student.boardName} - Class ${student.className}`
    : student.className
    ? `Class ${student.className}`
    : "No class assigned";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
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
        title={student.name}
        description={
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge active={student.isActive} />
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-500 tabular-nums">
              {student.registerNumber || "No register number"}
            </span>
          </div>
        }
      />

      {/* Section: Profile */}
      <Card>
        <CardHeader
          title="Profile"
          description="Basic student identifying information and class details."
          className="mb-5"
        />
        <StudentProfileForm
          studentId={student.id}
          initialName={student.name}
          initialRegisterNumber={student.registerNumber}
          email={student.email}
          classLabel={classLabel}
        />
      </Card>

      {/* Section: Subject Access */}
      <Card>
        <CardHeader
          title="Subject access"
          description={`Published subjects for ${classLabel}. Grant or revoke access at any time.`}
          className="mb-4"
        />

        {student.subjects.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 px-3 bg-slate-50 border border-[#E5E5E5] rounded-md text-center">
            No published subjects found for this class.
          </p>
        ) : (
          <div className="border border-[#E5E5E5] rounded-md divide-y divide-[#E5E5E5] overflow-hidden">
            {student.subjects.map((sub) => (
              <StudentSubjectRow
                key={sub.id}
                studentId={student.id}
                subjectId={sub.id}
                name={sub.name}
                isGranted={sub.isGranted}
                assignedAt={sub.assignedAt}
                revokedAt={sub.revokedAt}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Section: Account (Password & Status) */}
      <Card>
        <CardHeader
          title="Account"
          description="Manage student credentials and account active status."
          className="mb-5"
        />
        <div className="space-y-6">
          <StudentPasswordForm studentId={student.id} />
          <StudentStatusToggle
            studentId={student.id}
            isActive={student.isActive}
          />
        </div>
      </Card>

      {/* Section: Delete Student (Danger Zone) */}
      <Card className="border-rose-200">
        <CardHeader
          title="Delete student"
          description="Permanently delete this student account, authentication credentials, subject assignments, progress, and notes. This action cannot be undone."
          className="mb-5 border-rose-100"
        />
        <StudentDeleteForm
          studentId={student.id}
          expectedRegisterNumber={student.registerNumber || ""}
        />
      </Card>
    </div>
  );
}
