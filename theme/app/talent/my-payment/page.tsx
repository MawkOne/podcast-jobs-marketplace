import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import Badge from "@/components/Badge";
import StatBlock from "@/components/StatBlock";
import { formatDate } from "@/lib/format";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata(
  `Payments | ${SITE_NAME}`,
  "Your balance, payout method, and transactions.",
);

const TRANSACTIONS = [
  { id: "t_001", description: "Payout — Bright Signal Media", date: "2026-10-05T00:00:00Z", amount: 1800 },
  { id: "t_002", description: "Payout — Evergreen Docs", date: "2026-09-20T00:00:00Z", amount: 960 },
  { id: "t_003", description: "Platform fee", date: "2026-09-20T00:00:00Z", amount: -96 },
  { id: "t_004", description: "Payout — Halcyon Games", date: "2026-09-02T00:00:00Z", amount: 720 },
];

function usd(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

/** Payment info: balance, payout method, transaction list. */
export default function MyPaymentPage() {
  return (
    <AppShell variant="talent">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Payments</h1>
          <p className="mt-1 text-sm text-gray-500">
            Your earnings from completed gigs. Payouts run weekly — payment handling is a placeholder in this theme.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatBlock value={usd(428)} label="Available balance" />
          <StatBlock value={usd(3384)} label="Paid out to date" />
        </div>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-gray-900">Payout method</h2>
            <Badge tone="green">Verified</Badge>
          </div>
          <div className="mt-3 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <span className="flex h-8 w-12 items-center justify-center rounded bg-gray-900 text-[10px] font-semibold text-white">
              BANK
            </span>
            <div>
              <p className="text-sm font-medium text-gray-900">Checking •••• 4821</p>
              <p className="text-xs text-gray-500">Weekly payouts · next payout Friday</p>
            </div>
          </div>
          <button
            type="button"
            className="mt-3 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Update payout method
          </button>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-900">Transactions</h2>
          <ul className="mt-3 divide-y divide-gray-100">
            {TRANSACTIONS.map((transaction) => (
              <li key={transaction.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-xs text-gray-400">{formatDate(transaction.date)}</p>
                </div>
                <p
                  className={
                    transaction.amount >= 0
                      ? "text-sm font-semibold text-emerald-600"
                      : "text-sm font-semibold text-gray-500"
                  }
                >
                  {transaction.amount >= 0 ? "+" : ""}
                  {usd(transaction.amount)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
