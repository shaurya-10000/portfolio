"use client";

import { ArrowDown } from "lucide-react";

import HeroCanvas from "@/components/hero-canvas";
import { Button } from "@/components/ui";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import AboutCard from "@/components/about-card";
import WorldClock from "@/components/projects/world-clock";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Home() {
  return (
    <main className="relative min-h-screen w-full">
      <div className="fixed inset-0 z-0">
        <HeroCanvas />
      </div>

      <div className="relative z-10">
        <Header />

        {/* ── HERO ──────────────────────────────────────────── */}
        <section className="relative flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center px-4">
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent py-4 leading-[1.05] text-balance">
            Full-Stack Web Developer
          </h1>

          <p className="mt-6 max-w-[720px] text-base md:text-lg text-muted-foreground text-pretty">
            I build{" "}
            <span className="text-foreground font-semibold">
              web products end to end
            </span>{" "}
            — from database and API to interface and deployment. I care about{" "}
            <span className="text-foreground font-semibold">
              UI and UX
            </span>
            , write code that the next person can read, and ship things that
            actually work.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              onClick={() => scrollToId("projects")}
              className="group relative overflow-hidden bg-transparent border border-border text-foreground hover:text-background font-semibold transition-all duration-500 rounded-none px-6 py-6 tracking-wide before:absolute before:inset-0 before:bg-foreground before:scale-x-0 hover:before:scale-x-100 before:origin-left before:transition-transform before:duration-300 before:z-[-1] z-10"
            >
              View My Projects
            </Button>
            <Button
              variant="outline"
              onClick={() => scrollToId("about")}
              className="group relative overflow-hidden bg-transparent border border-border text-muted-foreground hover:text-foreground font-semibold transition-all duration-500 rounded-none px-6 py-6 tracking-wide before:absolute before:inset-0 before:bg-accent before:scale-y-0 hover:before:scale-y-100 before:origin-bottom before:transition-transform before:duration-300 before:z-[-1] z-10 hover:border-ring"
            >
              About Me
            </Button>
          </div>

          <button
            onClick={() => scrollToId("about")}
            aria-label="Scroll to about section"
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-foreground transition-colors animate-bounce"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </section>

        {/* ── SECTIONS ──────────────────────────────────────── */}
        <div id="about">
          <AboutCard />
        </div>

        {/*
          All projects live inside #projects.
          Add future projects as siblings of <WorldClock /> below.
        */}
        <div id="projects" className="flex flex-col">
          <WorldClock />
          {/* <ProjectXyz /> */}
          {/* <ProjectAbc /> */}
        </div>

        <Footer />
      </div>
    </main>
  );
}