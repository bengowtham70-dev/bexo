import { TalentBoard } from "@/components/talent/talent-board";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const CATEGORY_NAMES: Record<string, string> = {
  ai: "AI & Machine Learning",
  engineering: "Software Engineering",
  design: "Product & UI/UX Design",
  product: "Product Management",
  data: "Data Science & Analytics",
  growth: "Growth & Marketing",
};

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const catName = CATEGORY_NAMES[params.category.toLowerCase()];
  if (!catName) return { title: "Talent Directory — BEXO" };

  return {
    title: `${catName} Talent — BEXO`,
    description: `Discover top ${catName} professionals, engineers, and designers.`,
  };
}

export default function CategoryTalentPage({ params }: { params: { category: string } }) {
  const catKey = params.category.toLowerCase();
  const catTitle = CATEGORY_NAMES[catKey];

  if (!catTitle) {
    notFound();
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
        <div>
          <p className="mono text-xs tracking-[0.14em] uppercase text-[var(--color-muted)]">
            Category Directory
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mt-1">
            {catTitle}
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-1 max-w-[600px]">
            Browse active builders and engineers in {catTitle}.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <TalentBoard initialCategory={catKey} />
      </div>
    </div>
  );
}
