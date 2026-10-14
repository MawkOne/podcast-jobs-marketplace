/** Number, rate, and date formatting helpers (all display-side). */

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

/** Compact display: 1234567 → "1.2M", 4400 → "4.4K". */
export function formatCount(value: number): string {
  if (value >= 1_000_000) return trim(value / 1_000_000) + "M";
  if (value >= 1_000) return trim(value / 1_000) + "K";
  return formatNumber(value);
}

function trim(value: number): string {
  return value.toFixed(1).replace(/\.0$/, "");
}

export function formatRate(rate: number): string {
  return `${usd(rate)}/hr`;
}

export function formatRateRange(min: number, max: number): string {
  return `${usd(min)}–${usd(max)}/hr`;
}

function usd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(iso),
  );
}

/** "October 2026" — used in SEO titles that regenerate monthly. */
export function monthYear(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(date);
}

export function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const steps: Array<[number, string]> = [
    [31_536_000, "year"],
    [2_592_000, "month"],
    [604_800, "week"],
    [86_400, "day"],
    [3_600, "hour"],
    [60, "minute"],
  ];
  for (const [step, label] of steps) {
    const value = Math.floor(seconds / step);
    if (value >= 1) return `${value} ${label}${value > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

export function availabilityLabel(value: string): string {
  switch (value) {
    case "full_time":
      return "Full-time";
    case "part_time":
      return "Part-time";
    case "project_based":
      return "Project-based";
    default:
      return value;
  }
}

export function locationTypeLabel(value: string): string {
  switch (value) {
    case "remote":
      return "Remote";
    case "hybrid":
      return "Hybrid";
    case "onsite":
      return "Onsite";
    default:
      return value;
  }
}

/** Build a URL that keeps the current query params and applies `updates` (undefined removes a key). */
export function withParams(
  basePath: string,
  current: Record<string, string | undefined>,
  updates: Record<string, string | undefined>,
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(current)) {
    if (value) search.set(key, value);
  }
  for (const [key, value] of Object.entries(updates)) {
    if (value) search.set(key, value);
    else search.delete(key);
  }
  const qs = search.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/** Canonical path for a search page, preserving its query string. */
export function canonicalPath(basePath: string, params: Record<string, string | string[] | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    const first = Array.isArray(value) ? value[0] : value;
    if (first) search.set(key, first);
  }
  const qs = search.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
