"use client";

import * as React from "react";
import { Moon, Sun, Monitor, Settings, Check } from "lucide-react";
import { useTheme } from "next-themes";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";

type ThemeOption = {
  value: "light" | "dark" | "system";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
};

const THEME_OPTIONS: ThemeOption[] = [
  { value: "light", label: "Light", icon: Sun, accent: "text-amber-500" },
  { value: "dark", label: "Dark", icon: Moon, accent: "text-indigo-400" },
  { value: "system", label: "System", icon: Monitor, accent: "text-emerald-500" },
];

export function SettingsMenu() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open settings"
          className="h-9 w-9 rounded-full border border-border bg-card/50 hover:bg-accent transition-all focus-visible:ring-2 focus-visible:ring-ring/60"
        >
          <Settings className="h-[1.05rem] w-[1.05rem] text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-52 bg-card border-border text-foreground shadow-xl"
      >
        <DropdownMenuLabel className="text-[10px] text-muted-foreground font-mono uppercase tracking-[0.2em] px-2 py-1.5">
          Theme
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />

        {THEME_OPTIONS.map(({ value, label, icon: Icon, accent }) => {
          const isActive = mounted && theme === value;
          return (
            <DropdownMenuItem
              key={value}
              onClick={() => setTheme(value)}
              className="flex items-center gap-2.5 cursor-pointer focus:bg-accent focus:text-accent-foreground py-2.5"
            >
              <Icon className={`h-4 w-4 ${accent}`} />
              <span className="text-sm font-medium">{label}</span>
              {isActive && (
                <Check className="h-3.5 w-3.5 ml-auto text-muted-foreground" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}