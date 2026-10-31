"use client";

import { motion, type Variants } from "framer-motion";
import { FileText, Cpu, Globe, Code2, Layers, Mail } from "lucide-react";

import { Card } from "@/components/card";
import { GitHubIcon, LinkedInIcon } from "@/components/brand-icons";

/**
 * Ordered by relevance, not alphabetically.
 * Frontend: foundation → language → framework → styling → polish.
 * Backend: runtime → data → tooling → APIs → deploy → testing.
 * Top items are the ones most hiring managers scan for first.
 */
const FRONTEND_STACK = [
  "HTML / CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "TailwindCSS",
  "Framer Motion",
] as const;

const BACKEND_STACK = [
  "Node.js / Python",
  "PostgreSQL",
  "MongoDB",
  "Git / GitHub",
  "REST / tRPC",
  "Vercel",
  "Jest / Vitest",
] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 16, mass: 1 },
  },
};

export default function AboutCard() {
  return (
    <section id="about" className="py-24 px-6 md:px-8 max-w-7xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* ── MAIN IDENTITY CARD ─────────────────────────── */}
        <motion.div variants={itemVariants} className="md:col-span-2">
          <Card className="h-full bg-card/50 border-border p-8 flex flex-col justify-between relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold">
                  Based in India • Working Globally
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter text-foreground mb-4 text-balance">
                Full-Stack Web Developer & AI Engineer
              </h2>

              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-xl text-pretty">
                I build{" "}
                <span className="text-foreground font-semibold">
                  web products end to end
                </span>{" "}
                — database, API, frontend, deployment. I care about{" "}
                <span className="text-foreground font-semibold">
                  interfaces that feel considered
                </span>
                , code that the next person can read, and shipping things that
                actually work. Lately I&apos;ve been focused on{" "}
                <span className="text-foreground font-semibold">
                  AI integrations
                </span>{" "}
                that solve real problems instead of demos, backed by{" "}
                <span className="text-foreground font-semibold">
                  real test coverage
                </span>
                .
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-4 relative z-10">
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-bold hover:scale-[1.03] active:scale-[0.97] transition-transform"
              >
                <FileText className="w-4 h-4" />
                Download CV
              </a>

              <div className="flex gap-2">
                <a
                  href="https://github.com/shaurya-100000"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="GitHub"
                  className="p-2.5 rounded-full border border-border bg-secondary/50 hover:bg-secondary transition-colors text-foreground"
                >
                  <GitHubIcon className="w-5 h-5" />
                </a>
                <a
                  href="mailto:x"
                  title="Email"
                  className="p-2.5 rounded-full border border-border bg-secondary/50 hover:bg-secondary transition-colors text-foreground"
                >
                  <Mail className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/shaurya-10000"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn"
                  className="p-2.5 rounded-full border border-border bg-secondary/50 hover:bg-secondary transition-colors text-foreground"
                >
                  <LinkedInIcon className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/5 blur-[100px] group-hover:bg-primary/10 transition-all duration-500 pointer-events-none" />
          </Card>
        </motion.div>

        {/* ── TECH STACK CARD ────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <Card className="h-full bg-card/50 border-border p-8 flex flex-col relative overflow-hidden">
            <div className="flex items-center gap-2 mb-8 text-foreground">
              <Cpu className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">
                Core Development Stack
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                <span className="text-[10px] text-amber-500 font-bold uppercase tracking-tighter">
                  Frontend
                </span>
                <div className="flex flex-col gap-3">
                  {FRONTEND_STACK.map((tech) => (
                    <div
                      key={tech}
                      className="flex items-center gap-2 group/item"
                    >
                      <div className="h-px w-2 bg-border group-hover/item:bg-amber-500 transition-all" />
                      <span className="text-muted-foreground group-hover/item:text-foreground transition-colors font-medium text-[13px]">
                        {tech}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                  Backend
                </span>
                <div className="flex flex-col gap-3">
                  {BACKEND_STACK.map((tech) => (
                    <div
                      key={tech}
                      className="flex items-center gap-2 group/item"
                    >
                      <div className="h-px w-2 bg-border group-hover/item:bg-foreground/40 transition-all" />
                      <span className="text-muted-foreground group-hover/item:text-foreground transition-colors font-medium text-[13px]">
                        {tech}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* ── BOTTOM METRICS BAR ─────────────────────────── */}
        <motion.div variants={itemVariants} className="md:col-span-3">
          <Card className="p-8 bg-card/50 border-border">
            <div className="flex flex-col md:flex-row justify-between gap-8">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-foreground/5 text-foreground">
                  <Code2 className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                    Specialization
                  </span>
                  <span className="text-sm font-bold">
                    SaaS & AI Integration
                  </span>
                </div>
              </div>

              <div className="hidden md:block w-px h-12 bg-border/50" />

              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-foreground/5 text-foreground">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                    Architecture
                  </span>
                  <span className="text-sm font-bold">
                    Full-Stack, Test-Covered
                  </span>
                </div>
              </div>

              <div className="hidden md:block w-px h-12 bg-border/50" />

              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-foreground/5 text-foreground">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                    Focus
                  </span>
                  <span className="text-sm font-bold">
                    Product, Design & Reliability
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
}