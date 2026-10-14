import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/LoginForm";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata(
  `Log in | ${SITE_NAME}`,
  "Log in to apply to jobs, contact talent, or manage your company pipeline.",
);

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Log in to {SITE_NAME}</h1>
      <p className="mt-2 text-sm text-gray-500">
        Talent accounts land in the lead pipeline; company accounts land in applicant management.
      </p>
      <LoginForm />
      <p className="mt-6 text-center text-sm text-gray-500">
        New here?{" "}
        <Link href="/signup" className="font-medium text-indigo-600 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
