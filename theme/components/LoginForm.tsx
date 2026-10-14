"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DEMO_CREDENTIALS } from "@/lib/data";
import { verifyCredentials } from "@/lib/auth";

/**
 * Post-login destination by role — mirrors the live site's express-redirect
 * pattern (URL_STRUCTURE.md §9.1): talent → lead pipeline, company →
 * discovery/applicants, admin → account management.
 */
const DESTINATION_BY_ROLE: Record<string, string> = {
  talent: "/talent/lead-pipeline",
  company: "/channel/discovery",
  admin: "/account/management",
};

/**
 * Demo login form — verifies against the placeholder admin record
 * (lib/data.ts). Real deployments replace this with POST /api/auth/login
 * and store the JWT; the shape of verifyCredentials() matches that endpoint
 * so the swap is mechanical.
 */
export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = verifyCredentials(email, password);
    if (!result) {
      setError("Invalid email or password.");
      return;
    }
    // Redirect to the role's home surface (URL_STRUCTURE.md §9.1)
    setRedirecting(true);
    router.push(DESTINATION_BY_ROLE[result.user.role] ?? "/account");
  };

  if (redirecting) {
    return (
      <div className="mt-8 flex flex-col items-center gap-3 py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
        <p className="text-sm text-gray-500">Signing in…</p>
      </div>
    );
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none"
        />
      </div>
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
      <button
        type="submit"
        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
      >
        Log in
      </button>

      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Demo credentials
        </p>
        <p className="mt-1 font-mono text-xs text-gray-700">
          {DEMO_CREDENTIALS.email}
          <br />
          {DEMO_CREDENTIALS.password}
        </p>
      </div>
    </form>
  );
}
