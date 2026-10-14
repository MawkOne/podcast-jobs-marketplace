import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import SettingsForm from "./SettingsForm";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata(
  `Settings | ${SITE_NAME}`,
  "Manage your talent profile, notifications, and password.",
);

/** Talent settings — profile, notification toggles, password change. */
export default function TalentSettingsPage() {
  return (
    <AppShell variant="talent">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Your display info, notification preferences, and password.
          </p>
        </div>
        <SettingsForm />
      </div>
    </AppShell>
  );
}
