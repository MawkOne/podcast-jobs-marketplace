import Link from "next/link";

type SectionHeadingProps = {
  title: string;
  description?: string;
  action?: { label: string; href: string };
};

/** Section heading — tight, deep-navy, with an optional teal action link. */
export default function SectionHeading({ title, description, action }: SectionHeadingProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{title}</h2>
        {description ? <p className="mt-2 text-sm text-gray-500">{description}</p> : null}
      </div>
      {action ? (
        <Link href={action.href} className="text-sm font-semibold text-teal transition hover:text-teal-deep">
          {action.label} →
        </Link>
      ) : null}
    </div>
  );
}
