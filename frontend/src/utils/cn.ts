import clsx, { type ClassValue } from 'clsx';

/** Thin wrapper around clsx so call sites read `cn(...)` consistently. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(...inputs);
}
