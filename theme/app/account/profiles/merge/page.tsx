import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata(
  `Merge Profiles | ${SITE_NAME}`,
  "Combine two profiles into one.",
);

const PROFILES = [
  { id: "talent-164714", label: "Mya Walsh — Talent (Podcast Producer)" },
  { id: "company-bright-signal", label: "Bright Signal Media — Company" },
  { id: "talent-100241", label: "Maya Chen — Talent (Podcast Editor)" },
];

const selectClass =
  "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none";

/** Merge profiles: source → destination + confirm. */
export default function MergeProfilesPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Merge profiles</h1>
          <p className="mt-1 text-sm text-gray-500">
            Duplicate profiles happen. Pick a source and a destination — applications, reviews, and conversations
            move to the destination.
          </p>
        </div>

        <form className="space-y-5 rounded-xl border border-gray-200 bg-white p-6">
          <div>
            <label htmlFor="source" className="mb-1 block text-sm font-medium text-gray-700">
              Source profile (will be removed)
            </label>
            <select id="source" className={selectClass} defaultValue={PROFILES[2].id}>
              {PROFILES.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="destination" className="mb-1 block text-sm font-medium text-gray-700">
              Destination profile (keeps everything)
            </label>
            <select id="destination" className={selectClass} defaultValue={PROFILES[0].id}>
              {PROFILES.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.label}
                </option>
              ))}
            </select>
          </div>
          <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
            This can&apos;t be undone. The source profile is permanently merged into the destination.
          </p>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Confirm merge
          </button>
        </form>
      </div>
    </AppShell>
  );
}
