import type { Metadata } from "next";
import Link from "next/link";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata(
  `Create Your Company Account | ${SITE_NAME}`,
  "Sign up as a company, verify your show, and post your first job.",
);

const INDUSTRIES = [
  "Gaming",
  "Tech & SaaS",
  "Education",
  "Finance",
  "Fitness & Health",
  "Documentary",
  "Entertainment",
  "Other",
];

const inputClass =
  "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none";

/** Company signup — standalone page (like /login). */
export default function ChannelSignupPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create your company account</h1>
      <p className="mt-2 text-sm text-gray-500">
        Add your company details and show. Next you&apos;ll verify the show, then post your first job.
      </p>

      <form className="mt-6 space-y-4 rounded-xl border border-gray-200 bg-white p-6">
        <div>
          <label htmlFor="company-name" className="mb-1 block text-sm font-medium text-gray-700">
            Company name
          </label>
          <input id="company-name" type="text" placeholder="Bright Signal Media" className={inputClass} />
        </div>
        <div>
          <label htmlFor="industry" className="mb-1 block text-sm font-medium text-gray-700">
            Industry
          </label>
          <select id="industry" className={inputClass} defaultValue="">
            <option value="" disabled>
              Select an industry
            </option>
            {INDUSTRIES.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="website" className="mb-1 block text-sm font-medium text-gray-700">
            Website
          </label>
          <input id="website" type="url" placeholder="https://brightsignal.example" className={inputClass} />
        </div>
        <div>
          <label htmlFor="channel" className="mb-1 block text-sm font-medium text-gray-700">
            Show URL
          </label>
          <input
            id="channel"
            type="url"
            placeholder="https://shows.example/bright-signal"
            className={inputClass}
          />
          <p className="mt-1 text-xs text-gray-400">Verified in the next step — used to sync show stats.</p>
        </div>
        <div className="border-t border-gray-100 pt-4">
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
            Work email
          </label>
          <input id="email" type="email" placeholder="you@company.com" className={inputClass} />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <input id="password" type="password" placeholder="••••••••" className={inputClass} />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Create company account
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
