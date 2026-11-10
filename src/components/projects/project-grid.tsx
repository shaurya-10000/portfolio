"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ArrowUpRight, FolderOpen } from "lucide-react";

import { Card } from "@/components/card";
import {
  activeCategories,
  CATEGORY_LABEL,
  PROJECTS,
  type ProjectCategory,
} from "@/lib/projects";

type Filter = ProjectCategory | "all";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

export function ProjectGrid() {
  const categories = useMemo(() => activeCategories(), []);
  const [filter, setFilter] = useState<Filter>("all");

  const visible =
    filter === "all"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === filter);

  const tabs: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    ...categories.map((c) => ({ key: c, label: CATEGORY_LABEL[c] })),
  ];

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="projects"
        aria-labelledby="projects-heading"
        className="mx-auto max-w-7xl px-6 py-24 md:px-8"
      >
        <header className="mb-10 flex flex-col gap-4">
          <p className="flex items-center gap-2 text-sm font-medium text-amber-500">
            <FolderOpen className="size-3.5" aria-hidden />
            Selected work
          </p>

          <h2
            id="projects-heading"
            className="text-4xl font-bold tracking-tighter text-foreground text-balance sm:text-5xl"
          >
            Projects
          </h2>

          <p className="max-w-[680px] text-base leading-relaxed text-muted-foreground text-pretty">
            Filter by discipline, then open a case study. Every project has its
            own deep-dive page with screenshots, engineering notes and verified
            proof.
          </p>
        </header>

        {/* Filter tabs */}
        <div
          role="tablist"
          aria-label="Filter projects by discipline"
          className="mb-8 flex flex-wrap gap-2"
        >
          {tabs.map((tab) => {
            const active = tab.key === filter;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(tab.key)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${FOCUS_RING} ${
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card/50 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {visible.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/30 p-12 text-center">
            <p className="text-sm text-muted-foreground">
              No projects in this category yet.
            </p>
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((project) => (
                <motion.li
                  key={project.slug}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className={`group block h-full rounded-xl ${FOCUS_RING}`}
                  >
                    <Card className="flex h-full flex-col gap-4 border-border bg-card/50 p-6 transition-colors group-hover:border-foreground/40">
                      <div className="flex items-start justify-between gap-3">
                        <span className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          {CATEGORY_LABEL[project.category]}
                        </span>
                        <ArrowUpRight
                          className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                          aria-hidden
                        />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold tracking-tight text-foreground">
                          {project.title}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-amber-500">
                          {project.tagline}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
                          {project.summary}
                        </p>
                      </div>

                      <ul
                        aria-label="Technologies"
                        className="mt-auto flex flex-wrap gap-1.5 pt-2"
                      >
                        {project.stack.map((tag) => (
                          <li
                            key={tag}
                            className="rounded-full border border-border bg-secondary/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </Link>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </section>
    </MotionConfig>
  );
}