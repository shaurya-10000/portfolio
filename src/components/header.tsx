"use client";

import { SettingsMenu } from "@/components/settings-menu";

type NavLink = {
  href: string;
  label: string;
  accent?: boolean;
};

const NAV_LINKS: NavLink[] = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects", accent: true },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-8 py-4 backdrop-blur-md border-b border-border/40 bg-background/40">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="text-xl font-bold tracking-tighter text-foreground hover:text-muted-foreground transition-colors duration-300"
        aria-label="Scroll to top"
      >
        Shaurya
      </button>

      <div className="flex items-center gap-4 md:gap-6">
        <nav className="hidden md:flex gap-7 text-sm font-medium text-muted-foreground">
          {NAV_LINKS.map(({ href, label, accent }) => (
            <a
              key={label}
              href={href}
              className={`relative py-1 transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:transition-all after:duration-300 hover:after:w-full ${
                accent
                  ? "text-amber-500/90 after:bg-amber-500 hover:text-amber-400"
                  : "after:bg-foreground hover:text-foreground"
              }`}
            >
              {label}
            </a>
          ))}
        </nav>

        <SettingsMenu />
      </div>
    </header>
  );
}