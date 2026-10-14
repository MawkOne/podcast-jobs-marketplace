import Link from "next/link";
import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";
import type { Company } from "@/lib/data";

function host(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export default function CompanyCard({ company }: { company: Company }) {
  return (
    <div className="pw-card flex flex-col p-5">
      <div className="flex items-center gap-3">
        <Avatar src={company.logo_url} fallback={company.logo_fallback_initials} alt={company.company_name} />
        <div className="min-w-0">
          <Link
            href={`/companies/${company.company_id}`}
            className="block truncate text-sm font-semibold text-ink transition hover:text-teal"
          >
            {company.company_name}
          </Link>
          <p className="text-xs text-gray-500">{company.industry}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs">
        <a href={company.website} className="truncate font-medium text-teal hover:underline">
          {host(company.website)}
        </a>
        <Badge tone={company.status === "active" ? "green" : "amber"}>
          {company.status === "active" ? "Active" : "Prospect"}
        </Badge>
      </div>
    </div>
  );
}
