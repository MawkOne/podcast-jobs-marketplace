import type { Metadata } from "next";
import Link from "next/link";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata(
  `Create Your Account | ${SITE_NAME}`,
  "Sign up as a freelancer or a company on the marketplace.",
);

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

function pill(active: boolean): string {
  return active
    ? "rounded-lg bg-white px-3 py-2 text-center text-sm font-medium text-indigo-700 shadow-sm"
    : "rounded-lg px-3 py-2 text-center text-sm font-medium text-gray-500 hover:text-gray-900";
}

/** Signup router with a talent ↔ company toggle (?as=talent|company). */
export default async function SignupPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.as) ? sp.as[0] : sp.as;
  const mode = raw === "company" ? "company" : "talent";

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Join {SITE_NAME}</h1>
      <p className="mt-2 text-sm text-gray-500">Pick a side of the marketplace — you can change later.</p>

      <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1">
        <Link href="/signup?as=talent" className={pill(mode === "talent")}>
          I&apos;m a freelancer
        </Link>
        <Link href="/signup?as=company" className={pill(mode === "company")}>
          I&apos;m a company
        </Link>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        {mode === "talent" ? (
          <>
            <h2 className="text-lg font-semibold text-gray-900">Create your talent profile</h2>
            <p className="mt-1 text-sm text-gray-500">
              Pick a role from the eight-role taxonomy, add your account details, and verify your show to sync
              stats.
            </p>
            <form className="mt-5 space-y-4">
              <input
                type="text"
                placeholder="Display name"
                aria-label="Display name"
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                aria-label="Email"
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                aria-label="Password"
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                Create talent account
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-gray-900">Create your company account</h2>
            <p className="mt-1 text-sm text-gray-500">
              Add company details, verify your show, then post your first job.
            </p>
            <form className="mt-5 space-y-4">
              <input
                type="text"
                placeholder="Company name"
                aria-label="Company name"
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="email"
                placeholder="Work email"
                aria-label="Work email"
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                aria-label="Password"
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                Create company account
              </button>
            </form>
          </>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-indigo-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
