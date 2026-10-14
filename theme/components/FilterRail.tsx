import { formatNumber } from "@/lib/format";

export type FilterOption = { label: string; count?: number; href: string; active?: boolean };
export type FilterGroup = { label: string; options: FilterOption[] };

/**
 * Sidebar filter rail. Facet counts are computed before filtering (G6) —
 * counts come from the full catalog, so filters that exclude most of it say so.
 */
export default function FilterRail({ groups }: { groups: FilterGroup[] }) {
  return (
    <aside className="w-full shrink-0 lg:w-64">
      <div className="rounded-xl border border-gray-200 bg-white p-4 lg:sticky lg:top-20">
        <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
        {groups.map((group) => (
          <div key={group.label} className="mt-4 border-t border-gray-100 pt-4">
            <h3 className="text-xs font-medium uppercase tracking-wide text-gray-400">{group.label}</h3>
            <ul className="mt-2 space-y-0.5">
              {group.options.map((option) => (
                <li key={option.label}>
                  <a
                    href={option.href}
                    aria-current={option.active ? "true" : undefined}
                    className={
                      option.active
                        ? "flex items-center justify-between rounded-lg bg-indigo-50 px-2.5 py-1.5 text-sm font-medium text-indigo-700"
                        : "flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  >
                    <span>{option.label}</span>
                    {option.count !== undefined ? (
                      <span className="text-xs text-gray-400">{formatNumber(option.count)}</span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
