"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";

import type { ProjectEntry } from "@/lib/projects";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

export function ProjectPageShell({
  project,
  previous,
  next,
  children,
}: {
  project: ProjectEntry;
  previous: ProjectEntry | undefined;
  next: ProjectEntry | undefined;
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen w-full">
      {/* Back bar */}
      <div className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3 md:px-8">
          <Link
            href="/#projects"
            className={`inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground ${FOCUS_RING}`}
          >
            <ChevronLeft className="size-4" aria-hidden />
            All projects
          </Link>
          <span className="truncate text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {project.title}
          </span>
        </div>
      </div>

      {children}

      {/* Next / previous */}
      <nav
        aria-label="Project navigation"
        className="mx-auto grid max-w-7xl gap-4 border-t border-border px-6 py-12 md:grid-cols-2 md:px-8"
      >
        {previous ? (
          <Link
            href={`/projects/${previous.slug}`}
            className={`group flex flex-col gap-1 rounded-xl border border-border bg-card/50 p-5 transition-colors hover:border-foreground/40 ${FOCUS_RING}`}
          >
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <ArrowLeft className="size-3" aria-hidden />
              Previous
            </span>
            <span className="text-lg font-semibold text-foreground group-hover:underline">
              {previous.title}
            </span>
            <span className="text-sm text-muted-foreground">
              {previous.tagline}
            </span>
          </Link>
        ) : (
          <span aria-hidden />
        )}

        {next ? (
          <Link
            href={`/projects/${next.slug}`}
            className={`group flex flex-col items-end gap-1 rounded-xl border border-border bg-card/50 p-5 text-right transition-colors hover:border-foreground/40 ${FOCUS_RING}`}
          >
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Next
              <ArrowRight className="size-3" aria-hidden />
            </span>
            <span className="text-lg font-semibold text-foreground group-hover:underline">
              {next.title}
            </span>
            <span className="text-sm text-muted-foreground">
              {next.tagline}
            </span>
          </Link>
        ) : (
          <Link
            href="/#projects"
            className={`group flex flex-col items-end gap-1 rounded-xl border border-border bg-card/50 p-5 text-right transition-colors hover:border-foreground/40 ${FOCUS_RING}`}
          >
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Back to
              <ArrowRight className="size-3" aria-hidden />
            </span>
            <span className="text-lg font-semibold text-foreground group-hover:underline">
              All projects
            </span>
          </Link>
        )}
      </nav>
    </main>
  );
}