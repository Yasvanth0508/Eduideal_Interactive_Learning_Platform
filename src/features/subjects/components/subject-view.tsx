"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Search,
  Lock,
  MapPin,
  FlaskConical,
  Zap,
  Timer,
  Atom,
  Link2,
  Layers,
  Droplets,
  Wind,
  Leaf,
  BookOpen,
} from "lucide-react";

interface Lesson {
  id: number;
  lessonNumber: number;
  title: string;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  category: "Physical" | "Inorganic" | "Organic";
  status: "ACTIVE" | "LOCKED";
  unitsCount: number;
  icon: typeof FlaskConical;
}

const CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  Physical: {
    bg: "rgba(192, 34, 46, 0.08)",
    text: "var(--brand)",
    border: "rgba(192, 34, 46, 0.2)",
  },
  Inorganic: {
    bg: "rgba(5, 150, 105, 0.08)",
    text: "#047857",
    border: "rgba(5, 150, 105, 0.2)",
  },
  Organic: {
    bg: "rgba(217, 119, 6, 0.08)",
    text: "#B45309",
    border: "rgba(217, 119, 6, 0.2)",
  },
};

const LESSONS: Lesson[] = [
  {
    id: 1,
    lessonNumber: 1,
    title: "Lesson 1 — Solutions",
    name: "Solutions",
    slug: "solutions",
    subtitle: "Concentration · Raoult's Law · Colligative Properties",
    description:
      "Learn about solutions, concentration, solubility, vapour pressure, ideal and non-ideal solutions, colligative properties, and abnormal molar masses through interactive learning.",
    category: "Physical",
    status: "ACTIVE",
    unitsCount: 20,
    icon: FlaskConical,
  },
  {
    id: 2,
    lessonNumber: 2,
    title: "Lesson 2 — Electrochemistry",
    name: "Electrochemistry",
    slug: "electrochemistry",
    subtitle: "Galvanic Cells · Nernst Equation · Electrolysis",
    description:
      "Content is being prepared. Master redox systems, standard electrode potentials, conductance of electrolytes, and fuel cell technologies.",
    category: "Physical",
    status: "LOCKED",
    unitsCount: 7,
    icon: Zap,
  },
  {
    id: 3,
    lessonNumber: 3,
    title: "Lesson 3 — Chemical Kinetics",
    name: "Chemical Kinetics",
    slug: "chemical-kinetics",
    subtitle: "Rate Laws · Activation Energy · Order of Reaction",
    description:
      "Content is being prepared. Explore reaction rates, pseudo first-order reactions, Arrhenius equation, and collision theory models.",
    category: "Physical",
    status: "LOCKED",
    unitsCount: 6,
    icon: Timer,
  },
  {
    id: 4,
    lessonNumber: 4,
    title: "Lesson 4 — d & f Block Elements",
    name: "d & f Block Elements",
    slug: "d-and-f-block-elements",
    subtitle: "Transition Metals · Lanthanoids · Oxidation States",
    description:
      "Content is being prepared. Study periodic trends, electronic configurations, magnetic properties, and catalytic behavior of d & f block elements.",
    category: "Inorganic",
    status: "LOCKED",
    unitsCount: 5,
    icon: Atom,
  },
  {
    id: 5,
    lessonNumber: 5,
    title: "Lesson 5 — Coordination Compounds",
    name: "Coordination Compounds",
    slug: "coordination-compounds",
    subtitle: "Werner's Theory · IUPAC Naming · CFT",
    description:
      "Content is being prepared. Understand ligands, coordination numbers, crystal field theory, isomerism, and bonding theories.",
    category: "Inorganic",
    status: "LOCKED",
    unitsCount: 8,
    icon: Link2,
  },
  {
    id: 6,
    lessonNumber: 6,
    title: "Lesson 6 — Haloalkanes and Haloarenes",
    name: "Haloalkanes & Haloarenes",
    slug: "haloalkanes-and-haloarenes",
    subtitle: "SN1 & SN2 Mechanisms · Stereochemistry",
    description:
      "Content is being prepared. Master nucleophilic substitution, elimination reactions, organometallic reagents, and environmental effects.",
    category: "Organic",
    status: "LOCKED",
    unitsCount: 9,
    icon: Layers,
  },
  {
    id: 7,
    lessonNumber: 7,
    title: "Lesson 7 — Alcohols, Phenols and Ethers",
    name: "Alcohols, Phenols & Ethers",
    slug: "alcohols-phenols-and-ethers",
    subtitle: "Acidity of Phenols · Reimer-Tiemann Reaction",
    description:
      "Content is being prepared. Learn preparation methods, chemical properties, electrophilic aromatic substitution, and industrial applications.",
    category: "Organic",
    status: "LOCKED",
    unitsCount: 8,
    icon: Droplets,
  },
  {
    id: 8,
    lessonNumber: 8,
    title: "Lesson 8 — Aldehydes, Ketones & Carboxylic Acids",
    name: "Aldehydes, Ketones & Acids",
    slug: "aldehydes-ketones-and-carboxylic-acids",
    subtitle: "Nucleophilic Addition · Aldol Condensation",
    description:
      "Content is being prepared. Explore carbonyl reactivity, Cannizzaro reaction, oxidation-reduction pathways, and acid strength trends.",
    category: "Organic",
    status: "LOCKED",
    unitsCount: 10,
    icon: Wind,
  },
  {
    id: 9,
    lessonNumber: 9,
    title: "Lesson 9 — Amines",
    name: "Amines",
    slug: "amines",
    subtitle: "Basicity of Amines · Diazonium Salts",
    description:
      "Content is being prepared. Study alkylation, acylation, Gabriel phthalimide synthesis, and synthetic utility of diazonium salts.",
    category: "Organic",
    status: "LOCKED",
    unitsCount: 6,
    icon: Leaf,
  },
  {
    id: 10,
    lessonNumber: 10,
    title: "Lesson 10 — Biomolecules",
    name: "Biomolecules",
    slug: "biomolecules",
    subtitle: "Carbohydrates · Proteins · Nucleic Acids",
    description:
      "Content is being prepared. Discover monosaccharide structures, amino acid peptide bonds, enzyme kinetics, and DNA/RNA double helix structures.",
    category: "Organic",
    status: "LOCKED",
    unitsCount: 7,
    icon: BookOpen,
  },
];

const BRANCHES = [
  { city: "Perambur", address: "MPM Street", phone: "9884234949" },
  { city: "Kodungaiyur", address: "Near Pandiyan Theatre", phone: "9790924949" },
  { city: "Agaram Jn.", address: "Agaram Jn.", phone: "7845977500" },
];

interface SubjectViewProps {
  subjectSlug?: string;
  subjectName?: string;
}

export function SubjectView({
  subjectSlug = "chemistry",
  subjectName = "Chemistry",
}: SubjectViewProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories = ["All", "Physical", "Inorganic", "Organic"];

  const filteredLessons = LESSONS.filter((lesson) => {
    const matchesCategory =
      selectedCategory === "All" || lesson.category === selectedCategory;
    const matchesSearch =
      lesson.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLessonClick = (lesson: Lesson) => {
    if (lesson.status === "ACTIVE") {
      router.push(`/${subjectSlug}/${lesson.slug}`);
    } else {
      setToastMessage(
        `Lesson ${lesson.lessonNumber}: ${lesson.name} content is currently being prepared for CBSE 2026. Try Lesson 1: Solutions!`
      );
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black antialiased font-sans flex flex-col justify-between selection:bg-[#C0222E] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-sm bg-black text-white px-4 py-3 rounded-2xl shadow-2xl border border-white/10 text-xs flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="w-2 h-2 rounded-full bg-[#C0222E] animate-ping flex-shrink-0" />
          <span className="leading-snug">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E5E5] shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/eduideal-logo-BUtjWTvV.png"
              alt="EDUiDEAL Academy Logo"
              className="h-8 sm:h-9 w-auto object-contain block group-hover:scale-105 transition-transform"
            />
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-black hover:text-black bg-[#FAFAFA] hover:bg-slate-100 border border-[#E5E5E5] transition-all active:scale-95 shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#C0222E]" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Subject Hero */}
      <section className="bg-white border-b border-[#E5E5E5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-medium text-[#555555] mb-4">
            <Link href="/" className="hover:text-black transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-black font-semibold capitalize">{subjectName}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full inline-flex items-center gap-1.5 uppercase"
                style={{
                  background: "var(--brand-tint)",
                  color: "var(--brand)",
                  border: "1px solid var(--brand-border)",
                }}
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>CBSE CLASS 12 • {subjectName.toUpperCase()}</span>
              </span>

              <h1 className="text-3xl sm:text-5xl font-black text-black tracking-tight capitalize">
                Class 12 {subjectName}
              </h1>

              <p className="text-base sm:text-lg text-[#555555] leading-relaxed">
                Explore topic-wise interactive lessons, dynamic formula solvers,
                scientific charts, 3D visualizations, and NCERT practice questions.
              </p>
            </div>

            {/* Quick Stat Pill */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="px-4 py-3 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] text-center min-w-[120px]">
                <div className="text-2xl font-black text-black">10</div>
                <div className="text-[11px] font-semibold text-[#555555] uppercase tracking-wider">
                  Chapters
                </div>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] text-center min-w-[120px]">
                <div className="text-2xl font-black text-[#C0222E]">20+</div>
                <div className="text-[11px] font-semibold text-[#555555] uppercase tracking-wider">
                  Active Topics
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Chapters List Section */}
      <section className="py-10 sm:py-14 flex-1 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`
                      px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap
                      ${
                        isSelected
                          ? "bg-[#C0222E] text-white shadow-xs"
                          : "bg-white text-slate-700 hover:bg-slate-100 border border-[#E5E5E5]"
                      }
                    `}
                  >
                    {cat} {cat !== "All" && "Chemistry"}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chapters or topics..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-[#E5E5E5] rounded-xl text-black placeholder:text-slate-400 focus:outline-none focus:border-[#C0222E] transition-colors shadow-2xs"
              />
            </div>
          </div>

          {/* Chapter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLessons.map((lesson) => {
              const categoryStyle = CATEGORY_COLORS[lesson.category] || {
                bg: "#F1F5F9",
                text: "#475569",
                border: "#CBD5E1",
              };
              const IconComponent = lesson.icon;
              const isActive = lesson.status === "ACTIVE";

              return (
                <div
                  key={lesson.id}
                  onClick={() => handleLessonClick(lesson)}
                  className={`
                    group relative p-6 rounded-2xl bg-white border transition-all duration-200 flex flex-col justify-between cursor-pointer select-none
                    ${
                      isActive
                        ? "border-[#E5E5E5] hover:border-[#C0222E] hover:shadow-lg"
                        : "border-[#E5E5E5] opacity-80 hover:opacity-100 hover:border-slate-300"
                    }
                  `}
                >
                  <div>
                    {/* Header line */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[11px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider"
                          style={{
                            background: categoryStyle.bg,
                            color: categoryStyle.text,
                            border: `1px solid ${categoryStyle.border}`,
                          }}
                        >
                          {lesson.category}
                        </span>

                        <span className="text-xs font-mono font-semibold text-[#555555]">
                          Chapter {lesson.lessonNumber}
                        </span>
                      </div>

                      {isActive ? (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                          <span>Interactive</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>Coming Soon</span>
                        </span>
                      )}
                    </div>

                    {/* Title & Icon */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-xl font-bold text-black group-hover:text-[#C0222E] transition-colors leading-snug">
                        {lesson.name}
                      </h3>
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                        style={{
                          background: "var(--brand-tint)",
                          color: "var(--brand)",
                          border: "1px solid var(--brand-border)",
                        }}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-[#555555] mb-2 font-mono">
                      {lesson.subtitle}
                    </p>

                    <p className="text-xs text-[#555555] leading-relaxed line-clamp-3 mb-4">
                      {lesson.description}
                    </p>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-between">
                    <span className="text-xs font-medium text-[#555555] flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-[#C0222E]" />
                      <span>{lesson.unitsCount} Topics</span>
                    </span>

                    {isActive ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C0222E] group-hover:translate-x-1 transition-transform">
                        <span>Explore Chapter</span>
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
                        <span>Locked</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredLessons.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E5E5] p-8">
              <p className="text-[#555555] text-sm">
                No chapters found matching &quot;{searchQuery}&quot;.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5E5E5] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/eduideal-logo-BUtjWTvV.png"
                  alt="EDUiDEAL Academy"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <p className="text-xs text-[#555555] leading-relaxed max-w-sm">
                Interactive learning platform for CBSE Class 12 students.
                Designed for concept clarity, visual understanding, and board examination excellence.
              </p>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-bold text-xs text-black uppercase tracking-wider mb-3">
                EDUiDEAL Academy Branches
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {BRANCHES.map((b) => (
                  <div
                    key={b.city}
                    className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5]"
                  >
                    <div className="flex items-center gap-1 text-xs font-bold text-black">
                      <MapPin className="w-3 h-3 text-[#C0222E]" />
                      <span>{b.city}</span>
                    </div>
                    <div className="text-[11px] text-[#555555] mt-0.5">
                      {b.address}
                    </div>
                    <div className="text-[11px] font-semibold text-[#C0222E] mt-1">
                      {b.phone}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#555555]">
            <span>
              &copy; 2026 Learnova &bull; EDUiDEAL ACADEMY. All rights reserved.
            </span>
            <div className="flex items-center gap-4 font-mono">
              <Link href="/" className="hover:text-[#C0222E] transition-colors">
                Dashboard Overview
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
