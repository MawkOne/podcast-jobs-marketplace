import type { Metadata } from "next";
import Link from "next/link";
import { ROLES } from "@/lib/roles";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata(
  `Create Your Talent Profile | ${SITE_NAME}`,
  "Sign up as a freelancer, pick your role, and verify your show.",
);

const inputClass =
  "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none";

/** Talent signup — standalone page (like /login). */
export default function TalentSignupPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create your talent profile</h1>
      <p className="mt-2 text-sm text-gray-500">
        Pick your primary role from the eight-role taxonomy, add your account details, and verify your show to
        sync stats.
      </p>

      <form className="mt-6 space-y-4 rounded-xl border border-gray-200 bg-white p-6">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
            Display name
          </label>
          <input id="name" type="text" placeholder="Mya Walsh" className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input id="email" type="email" placeholder="you@example.com" className={inputClass} />
          <p className="mt-1 text-xs text-gray-400">Your email is never shown to companies — contact stays in-app.</p>
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <input id="password" type="password" placeholder="••••••••" className={inputClass} />
        </div>
        <div>
          <label htmlFor="role" className="mb-1 block text-sm font-medium text-gray-700">
            Primary role
          </label>
          <select id="role" className={inputClass} defaultValue="">
            <option value="" disabled>
              Select a role
            </option>
            {ROLES.map((role) => (
              <option key={role.slug} value={role.slug}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Create talent account
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-indigo-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
