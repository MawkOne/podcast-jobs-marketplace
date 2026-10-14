type PaginationProps = {
  basePath: string;
  page: number;
  totalPages: number;
  params?: Record<string, string>;
};

function pageHref(basePath: string, params: Record<string, string> | undefined, page: number): string {
  const search = new URLSearchParams(params ?? {});
  if (page > 1) search.set("page", String(page));
  else search.delete("page");
  const qs = search.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/** Keyset-style pagination UI (G7) — prev/next with page context. */
export default function Pagination({ basePath, page, totalPages, params }: PaginationProps) {
  if (totalPages <= 1) return null;
  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;
  const link =
    "rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-indigo-300 hover:text-indigo-700";
  const disabled =
    "pointer-events-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-300";
  return (
    <nav className="mt-8 flex items-center justify-between" aria-label="Pagination">
      <a href={pageHref(basePath, params, page - 1)} aria-disabled={prevDisabled} className={prevDisabled ? disabled : link}>
        Previous
      </a>
      <span className="text-sm text-gray-500">
        Page {page} of {totalPages}
      </span>
      <a href={pageHref(basePath, params, page + 1)} aria-disabled={nextDisabled} className={nextDisabled ? disabled : link}>
        Next
      </a>
    </nav>
  );
}
