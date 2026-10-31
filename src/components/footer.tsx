import { Mail } from "lucide-react";
import type { ComponentType } from "react";

import { GitHubIcon, LinkedInIcon } from "@/components/brand-icons";

type Social = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

const SOCIALS: Social[] = [
  {
    href: "https://github.com/shaurya-10000",
    label: "GitHub",
    icon: GitHubIcon,
  },
  {
    href: "https://www.linkedin.com/in/shaurya-10000",
    label: "LinkedIn",
    icon: LinkedInIcon,
  },
  {
    href: "mailto:x",
    label: "Email",
    icon: Mail,
  },
];

export function Footer() {
  return (
    <footer className="py-10 border-t border-border mx-6 md:mx-8 mt-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center md:items-start">
          <span className="text-lg font-bold tracking-tighter text-foreground">
            Shaurya
          </span>
          <p className="text-muted-foreground text-[10px] mt-1 uppercase tracking-[0.2em] font-medium">
            Full-Stack Web Developer
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="flex items-center gap-6 text-muted-foreground text-[11px] font-bold uppercase tracking-widest">
            {SOCIALS.map(({ href, label, icon: Icon }) => {
              const isExternal = href.startsWith("http");
              return (
                <a
                  key={label}
                  href={href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-1.5 hover:text-foreground transition-colors duration-300"
                >
                  <Icon className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  <span className="relative py-0.5 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-foreground hover:after:w-full after:transition-all after:duration-300">
                    {label}
                  </span>
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] font-black">
              Available
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}