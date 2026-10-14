import type { Metadata } from "next";
import Link from "next/link";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export function generateStaticParams() {
  return [
    { kind: "account", provider: "express" },
    { kind: "user", provider: "express" },
    { kind: "company", provider: "express" },
    { kind: "verify", provider: "twitter" },
  ];
}

type PageProps = { params: Promise<{ kind: string; provider: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { kind, provider } = await params;
  return noindexMetadata(
    `Redirecting… | ${SITE_NAME}`,
    `Express login redirect (${kind}/${provider}).`,
  );
}

const DESTINATIONS: Record<string, { label: string; href: string }> = {
  account: { label: "your account", href: "/account" },
  user: { label: "your pipeline", href: "/talent/lead-pipeline" },
  company: { label: "your applicants", href: "/channel/job/3f2a9c1e-8b4d-4c6a-9e2f-1d5b7a3c8e01/applicants" },
  verify: { label: "channel verification", href: "/company/profile-wizard" },
};

/**
 * Express-login redirect stub — most sessions arrive via email deep-links
 * (URL_STRUCTURE.md §9.1), not the login form. Live pattern is
 * `/redirect/{kind}/{provider}` (account/express, verify/twitter, …).
 * Renders "Redirecting…" plus a manual fallback link.
 */
export default async function RedirectPage({ params }: PageProps) {
  const { kind, provider } = await params;
  const destination = DESTINATIONS[kind] ?? { label: "your account", href: "/account" };

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <div className="mx-auto flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-gray-200 border-t-indigo-600" />
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">Redirecting…</h1>
      <p className="mt-2 text-sm text-gray-500">
        Signing you in and taking you to {destination.label}. This is the express-login redirect
        for <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">{kind}/{provider}</code>{" "}
        deep links.
      </p>
      <p className="mt-6 text-sm text-gray-500">
        Not moving?{" "}
        <Link href={destination.href} className="font-medium text-indigo-600 hover:underline">
          Continue manually
        </Link>
      </p>
    </div>
  );
}
