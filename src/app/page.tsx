"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { ArrowDown } from "lucide-react";

import { Button } from "@/components/ui";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const HeroCanvas = dynamic(() => import("@/components/hero-canvas"), {
  ssr: false,
  loading: () => null,
});

const AboutCard = dynamic(() => import("@/components/about-card"), {
  loading: () => <section className="min-h-[60vh]" aria-hidden="true" />,
});

const WorldClock = dynamic(() => import("@/components/projects/world-clock"), {
  ssr: false,
  loading: () => <section className="min-h-screen" aria-hidden="true" />,
});
const Cafe = dynamic(() => import("@/components/projects/cafe"), {
  ssr: false,
  loading: () => <section className="min-h-screen" aria-hidden="true" />,
});
const FpsGame = dynamic(() => import("@/components/projects/fps-game"), {
  ssr: false,
  loading: () => <section className="min-h-screen" aria-hidden="true" />,
});
const FpsGameWeb = dynamic(() => import("@/components/projects/fps-game-web"), {
  ssr: false,
  loading: () => <section className="min-h-screen" aria-hidden="true" />,
});

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

/**
 * The 3D hero is skipped on phone-sized screens, reduced-motion, Data Saver,
 * and low-core devices. Those visitors get the static gradient instead, which
 * avoids downloading and running ~1.2 MB of three.js on hardware that
 * struggles with a transmission shader.
 */
function shouldRender3D(): boolean {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  return !(
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    window.matchMedia("(max-width: 767px)").matches ||
    (navigator.hardwareConcurrency ?? 8) < 4 ||
    nav.connection?.saveData
  );
}

/**
 * Renders its children only once the placeholder is within `rootMargin` of the
 * viewport, so heavy below-the-fold sections don't compete with first paint.
 */
function LazyMount({
  children,
  minHeight = "100vh",
  rootMargin = "600px",
}: {
  children: ReactNode;
  minHeight?: string;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} style={visible ? undefined : { minHeight }}>
      {visible ? children : null}
    </div>
  );
}

export default function Home() {
  const [showCanvas, setShowCanvas] = useState(false);

  // Mount the heavy 3D scene only after the hero text has painted.
  useEffect(() => {
    if (!shouldRender3D()) return;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setShowCanvas(true), { timeout: 1500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(() => setShowCanvas(true), 300);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <main className="relative min-h-screen w-full">
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-background to-muted/30">
        {showCanvas && <HeroCanvas />}
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
          Add future projects as siblings of the WorldClock block below.
        */}
        <div id="projects" className="flex flex-col">
          <LazyMount>
            <WorldClock />
          </LazyMount>
          <LazyMount>
            <Cafe />
          </LazyMount>
          <LazyMount>
            <FpsGame />
          </LazyMount>
          <LazyMount>
            <FpsGameWeb />
          </LazyMount>
          {/* <ProjectXyz /> */}
          {/* <ProjectAbc /> */}
        </div>

        <Footer />
      </div>
    </main>
  );
}