"use client";

import { useState } from "react";
import { ROLES } from "@/lib/roles";

/** Category selection — ROLES as selectable cards. */
export default function CategoryPicker() {
  const [selected, setSelected] = useState<string[]>(["podcast-producers"]);

  function toggle(slug: string) {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((candidate) => candidate !== slug) : [...prev, slug],
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ROLES.map((role) => {
          const active = selected.includes(role.slug);
          return (
            <button
              key={role.slug}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(role.slug)}
              className={
                active
                  ? "rounded-xl border-2 border-indigo-600 bg-indigo-50/50 p-5 text-left transition"
                  : "rounded-xl border border-gray-200 bg-white p-5 text-left transition hover:border-indigo-300"
              }
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">{role.name}</span>
                <span
                  className={
                    active
                      ? "flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white"
                      : "flex h-5 w-5 items-center justify-center rounded-full border-2 border-gray-300 text-[10px] text-transparent"
                  }
                  aria-hidden="true"
                >
                  ✓
                </span>
              </div>
              <p className="mt-1 text-xs leading-5 text-gray-500">{role.description}</p>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">
          {selected.length} categor{selected.length === 1 ? "y" : "ies"} selected — you can change these anytime.
        </p>
        <button
          type="button"
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Save categories
        </button>
      </div>
    </div>
  );
}
