import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import CreateProfileForm from "./CreateProfileForm";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata(
  `Create a Profile | ${SITE_NAME}`,
  "Add a talent or company profile to your account.",
);

/** Create profile — talent/company toggle + form. */
export default function CreateProfilePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create a profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add another side to your account — a talent profile to work, a company profile to hire.
          </p>
        </div>
        <CreateProfileForm />
      </div>
    </AppShell>
  );
}
