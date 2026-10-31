import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names and resolve Tailwind conflicts.
 *
 * `clsx` flattens conditionals/arrays/objects into a single string.
 * `twMerge` then resolves conflicting utilities (e.g. `p-2 p-4` → `p-4`),
 * so the last class wins — which is what you want when a caller passes
 * `className` to override a component's defaults.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}