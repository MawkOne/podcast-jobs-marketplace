"use client";

import { useState } from "react";

const inputClass =
  "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none";

const TOGGLES = [
  { id: "notify-messages", label: "New messages", defaultOn: true },
  { id: "notify-applications", label: "Application status changes", defaultOn: true },
  { id: "notify-jobs", label: "New jobs matching your role", defaultOn: true },
  { id: "notify-digest", label: "Weekly email digest", defaultOn: false },
];

/** Settings form — visual placeholder with working notification toggles. */
export default function SettingsForm() {
  const [toggles, setToggles] = useState(() =>
    Object.fromEntries(TOGGLES.map((toggle) => [toggle.id, toggle.defaultOn])),
  );

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-gray-900">Profile</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="display-name" className="mb-1 block text-sm font-medium text-gray-700">
              Display name
            </label>
            <input id="display-name" type="text" defaultValue="Mya Walsh" className={inputClass} />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input id="email" type="email" defaultValue="mya.walsh@example.com" className={inputClass} />
            <p className="mt-1 text-xs text-gray-400">Never shown to companies — contact happens in-app.</p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-gray-900">Notifications</h2>
        <ul className="mt-4 space-y-3">
          {TOGGLES.map((toggle) => (
            <li key={toggle.id} className="flex items-center justify-between">
              <label htmlFor={toggle.id} className="text-sm text-gray-700">
                {toggle.label}
              </label>
              <button
                id={toggle.id}
                type="button"
                role="switch"
                aria-checked={toggles[toggle.id]}
                onClick={() => setToggles((prev) => ({ ...prev, [toggle.id]: !prev[toggle.id] }))}
                className={
                  toggles[toggle.id]
                    ? "relative h-6 w-11 rounded-full bg-indigo-600 transition"
                    : "relative h-6 w-11 rounded-full bg-gray-200 transition"
                }
              >
                <span
                  className={
                    toggles[toggle.id]
                      ? "absolute left-[1.375rem] top-0.5 h-5 w-5 rounded-full bg-white shadow transition"
                      : "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition"
                  }
                />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-gray-900">Change password</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="new-password" className="mb-1 block text-sm font-medium text-gray-700">
              New password
            </label>
            <input id="new-password" type="password" placeholder="••••••••" className={inputClass} />
          </div>
          <div>
            <label htmlFor="confirm-password" className="mb-1 block text-sm font-medium text-gray-700">
              Confirm new password
            </label>
            <input id="confirm-password" type="password" placeholder="••••••••" className={inputClass} />
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Save settings
        </button>
      </div>
    </div>
  );
}
