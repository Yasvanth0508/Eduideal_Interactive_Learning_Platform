"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";

interface Lesson {
  id: number;
  lessonNumber: number;
  title: string;
  name: string;
  subtitle: string;
  description: string;
  category: "Physical" | "Inorganic" | "Organic";
  status: "ACTIVE" | "LOCKED";
  route: string | null;
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
    subtitle: "Concentration · Raoult's Law · Colligative Properties",
    description:
      "Learn about solutions, concentration, solubility, vapour pressure, ideal and non-ideal solutions, colligative properties, and abnormal molar masses through interactive learning.",
    category: "Physical",
    status: "ACTIVE",
    route: "/solutions",
    unitsCount: 8,
    icon: FlaskConical,
  },
  {
    id: 2,
    lessonNumber: 2,
    title: "Lesson 2 — Electrochemistry",
    name: "Electrochemistry",
    subtitle: "Galvanic Cells · Nernst Equation · Electrolysis",
    description:
      "Content is being prepared. Master redox systems, standard electrode potentials, conductance of electrolytes, and fuel cell technologies.",
    category: "Physical",
    status: "LOCKED",
    route: null,
    unitsCount: 7,
    icon: Zap,
  },
  {
    id: 3,
    lessonNumber: 3,
    title: "Lesson 3 — Chemical Kinetics",
    name: "Chemical Kinetics",
    subtitle: "Rate Laws · Activation Energy · Order of Reaction",
    description:
      "Content is being prepared. Explore reaction rates, pseudo first-order reactions, Arrhenius equation, and collision theory models.",
    category: "Physical",
    status: "LOCKED",
    route: null,
    unitsCount: 6,
    icon: Timer,
  },
  {
    id: 4,
    lessonNumber: 4,
    title: "Lesson 4 — d- and f-Block Elements",
    name: "d- and f-Block Elements",
    subtitle: "Transition Metals · Lanthanides · Actinides",
    description:
      "Content is being prepared. Study electronic configurations, magnetic moments, interstitial compounds, and alloy formations.",
    category: "Inorganic",
    status: "LOCKED",
    route: null,
    unitsCount: 6,
    icon: Atom,
  },
  {
    id: 5,
    lessonNumber: 5,
    title: "Lesson 5 — Coordination Compounds",
    name: "Coordination Compounds",
    subtitle: "Ligands · CFSE · Werner's Theory",
    description:
      "Content is being prepared. Discover coordination entities, ligand field splitting, geometrical isomerism, and bio-coordination roles.",
    category: "Inorganic",
    status: "LOCKED",
    route: null,
    unitsCount: 7,
    icon: Link2,
  },
  {
    id: 6,
    lessonNumber: 6,
    title: "Lesson 6 — Haloalkanes & Haloarenes",
    name: "Haloalkanes & Haloarenes",
    subtitle: "SN1 · SN2 · Nucleophilic Substitution",
    description:
      "Content is being prepared. Learn nucleophilic substitutions, elimination pathways, organometallic reagents, and stereochemical outcomes.",
    category: "Organic",
    status: "LOCKED",
    route: null,
    unitsCount: 6,
    icon: Layers,
  },
  {
    id: 7,
    lessonNumber: 7,
    title: "Lesson 7 — Alcohols, Phenols & Ethers",
    name: "Alcohols, Phenols & Ethers",
    subtitle: "Hydroxyl Group · Dehydration · Reactions",
    description:
      "Content is being prepared. Examine alcohol preparation, acidity of substituted phenols, ether cleavage, and Williamson synthesis.",
    category: "Organic",
    status: "LOCKED",
    route: null,
    unitsCount: 7,
    icon: Droplets,
  },
  {
    id: 8,
    lessonNumber: 8,
    title: "Lesson 8 — Aldehydes, Ketones & Acids",
    name: "Aldehydes, Ketones & Acids",
    subtitle: "Carbonyl Chemistry · Nucleophilic Addition",
    description:
      "Content is being prepared. Master carbonyl reactivity, Tollens & Fehling tests, haloform reactions, and carboxylic acid acidity trends.",
    category: "Organic",
    status: "LOCKED",
    route: null,
    unitsCount: 8,
    icon: Wind,
  },
  {
    id: 9,
    lessonNumber: 9,
    title: "Lesson 9 — Amines",
    name: "Amines",
    subtitle: "Basic Character · Diazonium Salts · Coupling",
    description:
      "Content is being prepared. Investigate amine structure, gas vs aqueous basicity, Gabriel phthalimide synthesis, and coupling dyes.",
    category: "Organic",
    status: "LOCKED",
    route: null,
    unitsCount: 5,
    icon: Atom,
  },
  {
    id: 10,
    lessonNumber: 10,
    title: "Lesson 10 — Biomolecules",
    name: "Biomolecules",
    subtitle: "Carbohydrates · Proteins · Nucleic Acids",
    description:
      "Content is being prepared. Explore cyclic glucose structures, peptide linkages, secondary protein structures, and genetic codes.",
    category: "Organic",
    status: "LOCKED",
    route: null,
    unitsCount: 6,
    icon: Leaf,
  },
];

const BRANCHES = [
  { city: "Perambur", address: "MPM Street", phone: "9884234949" },
  { city: "Kodungaiyur", address: "Near Pandiyan Theatre", phone: "9790924949" },
  { city: "Agaram Jn.", address: "Agaram Jn.", phone: "7845977500" },
];

export default function ChemistryDemoPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const filteredLessons = LESSONS.filter((lesson) => {
    const matchesCategory =
      activeCategory === "All" || lesson.category === activeCategory;
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      lesson.title.toLowerCase().includes(query) ||
      lesson.subtitle.toLowerCase().includes(query) ||
      lesson.description.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-white text-black antialiased font-sans flex flex-col justify-between selection:bg-[#C0222E] selection:text-white">
      {/* Floating Notification Toast */}
      <div
        className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          toastMessage
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-3 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-900/95 text-white shadow-2xl border border-slate-700 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 animate-ping" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      </div>

      {/* Header */}
      <header
        className="sticky top-0 z-40 transition-all duration-300 bg-white/95 backdrop-blur-xl border-b border-[#E5E5E5]"
        style={{
          boxShadow: isScrolled ? "0 2px 16px rgba(0,0,0,0.06)" : "none",
        }}
      >
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
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Subjects</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero / Subject Overview */}
      <section className="bg-white border-b border-[#E5E5E5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-medium text-[#555555] mb-4">
            <Link href="/" className="hover:text-black transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-black font-semibold">Chemistry</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#555555]">10 Lessons</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5"
                  style={{
                    background: "var(--brand-tint)",
                    color: "var(--brand)",
                    border: "1px solid var(--brand-border)",
                  }}
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>CBSE Class 12 Chemistry</span>
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  <span>1 Lesson Active</span>
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FAFAFA] text-[#555555] border border-[#E5E5E5]">
                  9 Coming Soon
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight mb-3">
                Chemistry —{" "}
                <span style={{ color: "var(--brand)" }}>10 Lessons</span>
              </h1>

              <p className="text-sm sm:text-base text-[#555555] leading-relaxed max-w-2xl">
                Explore Class 12 Chemistry through interactive concepts, formula
                visualizations, dynamic graphs, revision notes, and topic-wise
                practice questions.
              </p>
            </div>

            {/* Currently Live Spotlight Card */}
            <div className="flex-shrink-0">
              <div className="p-5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] shadow-xs flex flex-col gap-3 min-w-[260px]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#555555]">
                    Currently Live
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Lesson 1 Ready
                  </span>
                </div>
                <div className="font-bold text-sm text-black">
                  Chapter 1: Solutions
                </div>
                <Link
                  href="/chemistry/solutions"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white transition-all shadow-sm active:scale-95 cursor-pointer"
                  style={{ background: "var(--brand)" }}
                >
                  <span>Start Solutions Lesson</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Filter Tabs & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-8 pt-6 border-t border-[#E5E5E5]">
            <div className="flex flex-wrap items-center gap-2">
              {["All", "Physical", "Inorganic", "Organic"].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeCategory === category
                      ? "text-white shadow-sm"
                      : "bg-[#FAFAFA] text-[#555555] hover:bg-slate-100 hover:text-black border border-[#E5E5E5]"
                  }`}
                  style={{
                    background:
                      activeCategory === category ? "var(--brand)" : undefined,
                  }}
                >
                  {category === "All"
                    ? "All 10 Lessons"
                    : `${category} Chemistry`}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search chemistry lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-[#E5E5E5] text-xs text-black placeholder:text-[#777777] focus:outline-none focus:border-[#C0222E] focus:ring-2 focus:ring-[#C0222E]/20 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Lessons Grid Section */}
      <section className="py-12 sm:py-16 flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => {
              const Icon = lesson.icon;
              const isActive = lesson.status === "ACTIVE";
              const catColor =
                CATEGORY_COLORS[lesson.category] || CATEGORY_COLORS.Physical;

              const handleCardClick = () => {
                if (isActive) {
                  router.push("/chemistry/solutions");
                } else {
                  showToast(
                    `${lesson.title} — Content is being prepared for upcoming release!`
                  );
                }
              };

              return (
                <div
                  key={lesson.id}
                  onClick={handleCardClick}
                  className={`group relative rounded-2xl border p-6 flex flex-col justify-between transition-all duration-200 select-none ${
                    isActive
                      ? "bg-white border-[#E5E5E5] hover:border-[#C0222E] hover:shadow-xl hover:shadow-red-900/5 cursor-pointer"
                      : "bg-[#FAFAFA]/60 border-[#E5E5E5] opacity-55 cursor-not-allowed"
                  }`}
                  style={{
                    boxShadow: isActive ? "0 2px 10px rgba(0,0,0,0.03)" : "none",
                  }}
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                          isActive
                            ? "text-white shadow-sm group-hover:scale-105"
                            : "bg-slate-100 text-slate-400"
                        }`}
                        style={{
                          background: isActive ? "var(--brand)" : undefined,
                        }}
                      >
                        <Icon className="w-6 h-6" />
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        <span className="text-[10px] font-bold font-mono tracking-widest text-[#777777]">
                          LESSON {String(lesson.lessonNumber).padStart(2, "0")}
                        </span>
                        {isActive ? (
                          <span className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                            <span>LIVE NOW</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-[#555555] border border-[#E5E5E5]">
                            <Lock className="w-2.5 h-2.5" />
                            <span>LOCKED</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mb-2.5">
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                        style={{
                          background: catColor.bg,
                          color: catColor.text,
                          border: `1px solid ${catColor.border}`,
                        }}
                      >
                        {lesson.category} Chemistry
                      </span>
                    </div>

                    <h3
                      className={`text-lg font-bold tracking-tight mb-1.5 ${
                        isActive
                          ? "text-black group-hover:text-[#C0222E] transition-colors"
                          : "text-[#555555]"
                      }`}
                    >
                      {lesson.title}
                    </h3>

                    <p className="text-xs font-medium text-[#555555] mb-3 leading-relaxed">
                      {lesson.subtitle}
                    </p>

                    <p className="text-xs text-[#555555] leading-relaxed line-clamp-3 mb-5">
                      {lesson.description}
                    </p>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-4 border-t border-[#E5E5E5] mt-auto">
                    {isActive ? (
                      <Link
                        href="/chemistry/solutions"
                        onClick={(e) => e.stopPropagation()}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white transition-all shadow-sm active:scale-95 cursor-pointer"
                        style={{ background: "var(--brand)" }}
                      >
                        <span>Start Learning</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-100 text-slate-400 border border-[#E5E5E5] cursor-not-allowed"
                      >
                        <Lock className="w-3 h-3" />
                        <span>Coming Soon</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredLessons.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E5E5] p-8">
              <p className="text-[#555555] text-sm">
                No lessons found matching your filter or search criteria.
              </p>
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                }}
                className="mt-3 text-xs font-bold underline cursor-pointer"
                style={{ color: "var(--brand)" }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Chemistry Page Footer */}
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
                Explore interactive concepts, visual learning, formulas, notes,
                and practice questions designed for CBSE Class 12 students.
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
              <Link href="/login" className="hover:text-[#C0222E] transition-colors">
                Portal Login
              </Link>
              <span>&bull;</span>
              <Link href="/" className="hover:text-[#C0222E] transition-colors">
                Subject Directory
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
