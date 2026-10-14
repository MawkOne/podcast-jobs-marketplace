import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import CategoryPicker from "./CategoryPicker";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata(
  `Categories | ${SITE_NAME}`,
  "Pick the roles you work under.",
);

/** Category selection from the eight-role taxonomy. */
export default function CategoryListPage() {
  return (
    <AppShell variant="talent">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Your categories</h1>
          <p className="mt-1 text-sm text-gray-500">
            Pick every role you work under — you&apos;ll appear in discovery, role landings, and job matches for each.
          </p>
        </div>
        <CategoryPicker />
      </div>
    </AppShell>
  );
}
