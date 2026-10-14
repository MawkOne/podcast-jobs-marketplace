"use client";

import { useState } from "react";

const inputClass =
  "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none";

/** Submit review — subject toggle, 1-5 star rating, title, body. */
export default function ReviewForm() {
  const [subjectType, setSubjectType] = useState<"talent" | "company">("talent");
  const [rating, setRating] = useState(5);

  return (
    <form className="space-y-5 rounded-xl border border-gray-200 bg-white p-6">
      {/* Subject type toggle */}
      <div>
        <span className="mb-1.5 block text-sm font-medium text-gray-700">Who are you reviewing?</span>
        <div className="grid grid-cols-2 gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
          {(["talent", "company"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSubjectType(type)}
              className={
                subjectType === type
                  ? "rounded-md bg-white px-3 py-2 text-center text-sm font-medium text-indigo-700 shadow-sm"
                  : "rounded-md px-3 py-2 text-center text-sm font-medium text-gray-500 hover:text-gray-900"
              }
            >
              A {type === "talent" ? "freelancer" : "company"}
            </button>
          ))}
        </div>
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="mb-1 block text-sm font-medium text-gray-700">
          {subjectType === "talent" ? "Freelancer name" : "Company name"}
        </label>
        <input
          id="subject"
          type="text"
          placeholder={subjectType === "talent" ? "Mya Walsh" : "Bright Signal Media"}
          className={inputClass}
        />
      </div>

      {/* Rating stars */}
      <div>
        <span className="mb-1.5 block text-sm font-medium text-gray-700">Rating</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              aria-label={`${value} star${value === 1 ? "" : "s"}`}
              aria-pressed={rating === value}
              onClick={() => setRating(value)}
              className={
                value <= rating
                  ? "text-2xl leading-none text-amber-400 transition hover:text-amber-500"
                  : "text-2xl leading-none text-gray-300 transition hover:text-amber-300"
              }
            >
              ★
            </button>
          ))}
          <span className="ml-2 self-center text-sm text-gray-500">{rating}/5</span>
        </div>
      </div>

      {/* Title & body */}
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
          Title
        </label>
        <input id="title" type="text" placeholder="Sum up the experience" className={inputClass} />
      </div>
      <div>
        <label htmlFor="body" className="mb-1 block text-sm font-medium text-gray-700">
          Review
        </label>
        <textarea
          id="body"
          rows={4}
          placeholder="What was it like working together? Delivery, communication, quality…"
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
      >
        Submit review
      </button>
    </form>
  );
}
