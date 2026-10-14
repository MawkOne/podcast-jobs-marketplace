import { formatDate } from "@/lib/format";

/** G1 — freshness banner for catalog pages; never imply profiles are live. */
export default function DataAsOfBanner({ date }: { date: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-500">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-4 w-4 shrink-0 text-gray-400"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" strokeLinecap="round" />
      </svg>
      <p>Catalog data as of {formatDate(date)} — profiles are synced snapshots, not live feeds.</p>
    </div>
  );
}
