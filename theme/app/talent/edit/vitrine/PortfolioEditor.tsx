"use client";

import { useState } from "react";

type PortfolioItem = {
  id: number;
  title: string;
  kind: string;
  url: string;
};

const INITIAL_ITEMS: PortfolioItem[] = [
  { id: 1, title: "Q4 Rebrand Series — Episode 1", kind: "Full episode edit", url: "shows.example/demo1" },
  { id: 2, title: "True Crime Docs — Field Package", kind: "Field recording", url: "shows.example/demo2" },
  { id: 3, title: "Branded Clips Pack", kind: "Clips", url: "shows.example/demo3" },
];

/** Portfolio editor — add/remove works locally; edit buttons are placeholders. */
export default function PortfolioEditor() {
  const [items, setItems] = useState<PortfolioItem[]>(INITIAL_ITEMS);

  return (
    <div className="space-y-4">
      <ul className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
        {items.map((item) => (
          <li key={item.id} className="flex flex-wrap items-center gap-4 p-5">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900">{item.title}</p>
              <p className="mt-0.5 text-xs text-gray-500">
                {item.kind} · <span className="font-mono">{item.url}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setItems((prev) => prev.filter((candidate) => candidate.id !== item.id))}
                className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
        {items.length === 0 ? (
          <li className="p-8 text-center text-sm text-gray-500">No portfolio items yet — add your best work.</li>
        ) : null}
      </ul>

      <button
        type="button"
        onClick={() =>
          setItems((prev) => [
            ...prev,
            {
              id: prev.length ? Math.max(...prev.map((item) => item.id)) + 1 : 1,
              title: `New portfolio item ${prev.length + 1}`,
              kind: "Episode",
              url: "shows.example/new",
            },
          ])
        }
        className="w-full rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600 transition hover:border-indigo-300 hover:text-indigo-700"
      >
        + Add portfolio item
      </button>
    </div>
  );
}
