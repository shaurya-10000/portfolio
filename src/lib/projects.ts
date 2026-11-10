/**
 * Single source of truth for the project index.
 *
 * Add a new project here and it appears in the grid, in the filter
 * tabs, in the next/previous navigation on its own page, and at its
 * own /projects/<slug> URL. No other file needs to change.
 */

export type ProjectCategory =
  | "full-stack"
  | "frontend"
  | "backend"
  | "languages";

export type ProjectEntry = {
  slug: string;
  title: string;
  category: ProjectCategory;
  tagline: string;
  /** Short stack labels shown on the card. */
  stack: readonly string[];
  /** 1-line blurb shown under the title on the card. */
  summary: string;
  /** Ordered list of component keys that render the case study. */
  sections: readonly ProjectSectionKey[];
};

export type ProjectSectionKey =
  | "world-clock"
  | "cafe"
  | "fps-game"
  | "fps-game-web"
  | "pysubset-interpreter";

export const CATEGORY_LABEL: Record<ProjectCategory, string> = {
  "full-stack": "Full-stack",
  frontend: "Frontend",
  backend: "Backend",
  languages: "Languages",
};

export const PROJECTS: readonly ProjectEntry[] = [
  {
    slug: "world-clock",
    title: "World Clock",
    category: "frontend",
    tagline: "An astronomically-correct 3D world clock.",
    summary:
      "Interactive 3D globe, 180+ cities, and time travel to solstices, equinoxes and sunrises — all driven by the actual position of the sun.",
    stack: ["Next.js", "React Three Fiber", "TypeScript", "Tailwind"],
    sections: ["world-clock"],
  },
  {
    slug: "cafe",
    title: "Cafe",
    category: "full-stack",
    tagline: "A cafe platform with a streaming AI concierge.",
    summary:
      "Order, book and pay in one flow. Database-enforced pricing, RLS-first security, Stripe ledger, and a Gemini-powered concierge that emits typed, confirm-gated actions.",
    stack: ["Next.js", "Supabase", "Clerk", "Stripe", "Gemini"],
    sections: ["cafe"],
  },
  {
    slug: "fps-game",
    title: "FPS Game Database",
    category: "full-stack",
    tagline: "Backend + realtime frontend for a competitive FPS game.",
    summary:
      "Canonical match recording, transactional outbox, sequence-ordered Elo, real-time chat and WebRTC calls — paired with a Next.js catalog and dashboard that consumes it.",
    stack: ["Node.js", "MongoDB", "Socket.IO", "Next.js", "WebRTC"],
    sections: ["fps-game", "fps-game-web"],
  },
  {
    slug: "pysubset-interpreter",
    title: "PySubset Interpreter",
    category: "languages",
    tagline: "A Python interpreter for a subset of Python, from scratch.",
    summary:
      "Hand-written lexer, recursive-descent parser and tree-walking evaluator. No ast, no eval. Classes, exceptions, f-strings, comprehensions and generators — all verified against CPython.",
    stack: ["Python 3.12", "Hand-written lexer", "Recursive descent"],
    sections: ["pysubset-interpreter"],
  },
];

/** Category tabs to render, derived from the projects that actually exist. */
export function activeCategories(): readonly ProjectCategory[] {
  const seen = new Set<ProjectCategory>();
  for (const p of PROJECTS) seen.add(p.category);
  const order: ProjectCategory[] = [
    "full-stack",
    "frontend",
    "backend",
    "languages",
  ];
  return order.filter((c) => seen.has(c));
}

export function getProject(slug: string): ProjectEntry | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

/** Ordered slugs for next/previous navigation. */
export function projectNeighbours(slug: string): {
  previous: ProjectEntry | undefined;
  next: ProjectEntry | undefined;
} {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  if (i === -1) return { previous: undefined, next: undefined };
  return {
    previous: i > 0 ? PROJECTS[i - 1] : undefined,
    next: i < PROJECTS.length - 1 ? PROJECTS[i + 1] : undefined,
  };
}