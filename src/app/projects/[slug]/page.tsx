import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectPageShell } from "@/components/projects/project-page-shell";
import WorldClock from "@/components/projects/world-clock";
import Cafe from "@/components/projects/cafe";
import FpsGame from "@/components/projects/fps-game";
import FpsGameWeb from "@/components/projects/fps-game-web";
import PySubset from "@/components/projects/pysubset-interpreter";

import {
  getProject,
  PROJECTS,
  projectNeighbours,
  type ProjectSectionKey,
} from "@/lib/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.summary,
  };
}

function renderSection(key: ProjectSectionKey) {
  switch (key) {
    case "world-clock":
      return <WorldClock />;
    case "cafe":
      return <Cafe />;
    case "fps-game":
      return <FpsGame />;
    case "fps-game-web":
      return <FpsGameWeb />;
    case "pysubset-interpreter":
      return <PySubset />;
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { previous, next } = projectNeighbours(slug);

  return (
    <ProjectPageShell project={project} previous={previous} next={next}>
      {project.sections.map((key) => (
        <div key={key}>{renderSection(key)}</div>
      ))}
    </ProjectPageShell>
  );
}