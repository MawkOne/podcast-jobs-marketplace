import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";
import EmptyState from "@/components/EmptyState";
import JobCard from "@/components/JobCard";
import JsonLd from "@/components/JsonLd";
import SectionHeading from "@/components/SectionHeading";
import StatBlock from "@/components/StatBlock";
import TalentCard from "@/components/TalentCard";
import { getCompany, getReviews, listCompanies } from "@/lib/data";
import { formatCount } from "@/lib/format";
import { companyTitle, organizationJsonLd, pageMetadata, SITE_NAME } from "@/lib/seo";

export function generateStaticParams() {
  return listCompanies().map((company) => ({ id: company.company_id }));
}

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const company = getCompany(id);
  if (!company) return {};
  return pageMetadata(
    companyTitle(company.company_name),
    `${company.company_name} — ${company.industry} company on ${SITE_NAME}. Open roles and talent matches.`,
    `/companies/${company.company_id}`,
  );
}

export default async function CompanyPage({ params }: PageProps) {
  const { id } = await params;
  const company = getCompany(id);
  if (!company) notFound();
  const reviews = getReviews(`company:${company.company_id}`);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Organization JSON-LD */}
      <JsonLd data={organizationJsonLd(company)} />

      {/* Header: logo fallback, name, website, status, industry */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar src={company.logo_url} fallback={company.logo_fallback_initials} alt={company.company_name} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">{company.company_name}</h1>
              <Badge tone={company.status === "active" ? "green" : "amber"}>
                {company.status === "active" ? "Active" : "Prospect"}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-gray-500">{company.industry}</p>
            <a
              href={company.website}
              className="mt-1 inline-block text-sm text-indigo-600 hover:underline"
            >
              {company.website.replace(/^https?:\/\//, "")}
            </a>
          </div>
        </div>
      </div>

      {/* Description — collapses when NULL (G9) */}
      {company.description ? (
        <section className="mt-8">
          <SectionHeading title="About" />
          <p className="mt-3 max-w-3xl leading-7 text-gray-600">{company.description}</p>
        </section>
      ) : null}

      {/* Subscriber count — only rendered when present */}
      {company.subscriber_count !== null ? (
        <section className="mt-8 max-w-xs">
          <StatBlock value={formatCount(company.subscriber_count)} label="Subscribers across shows" />
        </section>
      ) : null}

      {/* Contact card — only rendered when present */}
      {company.contact_name ? (
        <section className="mt-8 max-w-xs rounded-xl border border-gray-200 bg-gray-50 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Contact</h2>
          <p className="mt-2 text-sm text-gray-700">{company.contact_name}</p>
          <p className="mt-1 text-xs text-gray-500">Reach out through the marketplace — contact details are auth-gated.</p>
        </section>
      ) : null}

      {/* Open roles — empty-state CTA until jobs exist */}
      <section className="mt-10">
        <SectionHeading title="Open roles" description="Live listings from this company." />
        <div className="mt-4">
          {company.open_roles.length === 0 ? (
            <EmptyState
              title="No open roles right now"
              description={`${company.company_name} hasn't posted any jobs yet. Companies that post roles get matched with talent from the catalog.`}
              action={{ label: "Post a job", href: "/signup?as=company" }}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {company.open_roles.map((job) => (
                <JobCard key={job.job_id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Talent matches — industry ↔ functional area join */}
      <section className="mt-10">
        <SectionHeading
          title="Talent matches"
          description="Catalog talent whose functional area fits this company's industry."
        />
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {company.talent_matches.map((talent) => (
            <TalentCard key={talent.user_id} talent={talent} />
          ))}
        </div>
      </section>

      {/* Reviews — collapse when absent (G9) */}
      {reviews.results.length > 0 ? (
        <section className="mt-10">
          <SectionHeading title={`Reviews · ${reviews.average_rating.toFixed(1)} average`} />
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {reviews.results.map((review) => (
              <div key={review.review_id} className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-900">{review.title}</p>
                  <Badge tone="amber">{"★".repeat(review.rating)}</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-600">{review.body}</p>
                <p className="mt-3 text-xs text-gray-400">{review.reviewer.display_name}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
