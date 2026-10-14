"use client";

import { useState } from "react";
import { ROLES } from "@/lib/roles";

const inputClass =
  "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none";

/** Create-profile form with a talent/company toggle. */
export default function CreateProfileForm() {
  const [kind, setKind] = useState<"talent" | "company">("talent");

  return (
    <form className="space-y-5 rounded-xl border border-gray-200 bg-white p-6">
      <div className="grid grid-cols-2 gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
        {(["talent", "company"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setKind(type)}
            className={
              kind === type
                ? "rounded-md bg-white px-3 py-2 text-center text-sm font-medium text-indigo-700 shadow-sm"
                : "rounded-md px-3 py-2 text-center text-sm font-medium text-gray-500 hover:text-gray-900"
            }
          >
            {type === "talent" ? "Talent profile" : "Company profile"}
          </button>
        ))}
      </div>

      {kind === "talent" ? (
        <>
          <div>
            <label htmlFor="display-name" className="mb-1 block text-sm font-medium text-gray-700">
              Display name
            </label>
            <input id="display-name" type="text" placeholder="Mya Walsh" className={inputClass} />
          </div>
          <div>
            <label htmlFor="primary-role" className="mb-1 block text-sm font-medium text-gray-700">
              Primary role
            </label>
            <select id="primary-role" className={inputClass} defaultValue="">
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
        </>
      ) : (
        <>
          <div>
            <label htmlFor="company-name" className="mb-1 block text-sm font-medium text-gray-700">
              Company name
            </label>
            <input id="company-name" type="text" placeholder="Bright Signal Media" className={inputClass} />
          </div>
          <div>
            <label htmlFor="website" className="mb-1 block text-sm font-medium text-gray-700">
              Website
            </label>
            <input id="website" type="url" placeholder="https://brightsignal.example" className={inputClass} />
          </div>
        </>
      )}

      <button
        type="submit"
        className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
      >
        Create {kind} profile
      </button>
    </form>
  );
}
