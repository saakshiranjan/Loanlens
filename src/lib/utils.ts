import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatRelativeDate(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(d);
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

export const LOAN_TYPES = [
  { value: "PERSONAL", label: "Personal Loan", icon: "💳" },
  { value: "HOME", label: "Home Loan", icon: "🏠" },
  { value: "EDUCATION", label: "Education Loan", icon: "🎓" },
  { value: "VEHICLE", label: "Vehicle Loan", icon: "🚗" },
  { value: "BUSINESS", label: "Business Loan", icon: "💼" },
] as const;

export type LoanType = (typeof LOAN_TYPES)[number]["value"];

export const EMPLOYMENT_TYPES = [
  { value: "SALARIED", label: "Salaried Employee" },
  { value: "SELF_EMPLOYED", label: "Self-Employed / Business Owner" },
  { value: "OTHER", label: "Other" },
] as const;

export const CREDIT_SCORE_RANGES = [
  { value: "EXCELLENT", label: "Excellent (800+)", min: 800 },
  { value: "GOOD", label: "Good (700–799)", min: 700 },
  { value: "FAIR", label: "Fair (600–699)", min: 600 },
  { value: "POOR", label: "Poor (below 600)", min: 0 },
  { value: "UNKNOWN", label: "I don't know my score", min: 0 },
] as const;
