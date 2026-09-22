import type { Metadata } from "next";
import { SubjectView } from "@/features/subjects/components/subject-view";

export const metadata: Metadata = {
  title: "CBSE Class 12 Chemistry — Lessons & Topics | Learnova",
  description:
    "Explore interactive chemistry concepts, dynamic formulas, scientific charts, 3D simulations, and topic-wise practice problems for CBSE Class 12.",
};

export default function ChemistryPage() {
  return <SubjectView subjectSlug="chemistry" subjectName="Chemistry" />;
}
