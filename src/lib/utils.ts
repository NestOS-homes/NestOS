import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Joins Tailwind class names and removes conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
