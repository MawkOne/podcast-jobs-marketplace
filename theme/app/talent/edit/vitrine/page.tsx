import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import PortfolioEditor from "./PortfolioEditor";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata(
  `Edit Portfolio | ${SITE_NAME}`,
  "Manage your portfolio items.",
);

/** Portfolio (vitrine) editor. */
export default function VitrineEditorPage() {
  return (
    <AppShell variant="talent">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit your portfolio</h1>
          <p className="mt-1 text-sm text-gray-500">
            Your best work, front and center. Profiles with 3+ items get contacted most.
          </p>
        </div>
        <PortfolioEditor />
        <p className="text-xs text-gray-400">
          Changes are visual placeholders — the real flow saves back to your profile snapshot.
        </p>
      </div>
    </AppShell>
  );
}
