import type { Metadata } from "next";
import Link from "next/link";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata(
  `Set Your Password | ${SITE_NAME}`,
  "Set a new password with a single-use token.",
);

const inputClass =
  "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none";

/** Token-gated password set — standalone page (like /login). */
export default function SetPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Set your password</h1>
      <p className="mt-2 text-sm text-gray-500">
        This link is token-gated and valid for a single use. Setting a password signs you in on this device.
      </p>

      <form className="mt-6 space-y-4 rounded-xl border border-gray-200 bg-white p-6">
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
            New password
          </label>
          <input id="password" type="password" placeholder="••••••••" className={inputClass} />
        </div>
        <div>
          <label htmlFor="confirm" className="mb-1 block text-sm font-medium text-gray-700">
            Confirm new password
          </label>
          <input id="confirm" type="password" placeholder="••••••••" className={inputClass} />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Set password
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Token expired?{" "}
        <Link href="/login" className="font-medium text-indigo-600 hover:underline">
          Log in to request a new one
        </Link>
      </p>
    </div>
  );
}
