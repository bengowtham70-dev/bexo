export type SearchFilters = {
  q?: string;
  skills?: string;
  location?: string;
  remote?: string;
  experience?: string;
  availability?: string;
  employmentType?: string;
  compensation?: string;
  industry?: string;
  verification?: string;
  category?: string;
};

export function buildQuery(filters: SearchFilters) {
  const where: any = {
    visibility: "PUBLIC" as const,
    hideFromSearch: false,
  };

  const orConditions: any[] = [];

  if (filters.q && filters.q.trim()) {
    const term = filters.q.trim();
    orConditions.push(
      { headline: { contains: term, mode: "insensitive" } },
      { bio: { contains: term, mode: "insensitive" } },
      { location: { contains: term, mode: "insensitive" } },
      { skills: { some: { name: { contains: term, mode: "insensitive" } } } },
      { projects: { some: { name: { contains: term, mode: "insensitive" } } } }
    );
  }

  if (orConditions.length > 0) {
    where.OR = orConditions;
  }

  if (filters.location && filters.location.trim()) {
    where.location = { contains: filters.location.trim(), mode: "insensitive" };
  }

  if (filters.remote === "true" || filters.remote === "Remote") {
    where.location = {
      ...(where.location || {}),
      contains: "Remote",
      mode: "insensitive",
    };
  }

  if (filters.skills && filters.skills.trim()) {
    const skillList = filters.skills.split(",").map((s) => s.trim()).filter(Boolean);
    if (skillList.length > 0) {
      where.skills = {
        some: {
          OR: skillList.map((s) => ({ name: { contains: s, mode: "insensitive" } })),
        },
      };
    }
  }

  if (filters.category && filters.category.trim()) {
    const cat = filters.category.trim().toLowerCase();
    where.category = cat;
  }

  return where;
}
