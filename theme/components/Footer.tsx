import Link from "next/link";
import Logo from "@/components/Logo";
import { SITE_NAME } from "@/lib/seo";

const GROUPS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "For Talent",
    links: [
      { label: "Create a profile", href: "/talent/signup" },
      { label: "Find opportunities", href: "/talent/jobs" },
      { label: "Pricing", href: "/faq" },
      { label: "Success stories", href: "/how-it-works" },
    ],
  },
  {
    title: "For Clients",
    links: [
      { label: "Post a project", href: "/hire" },
      { label: "Find talent", href: "/talent/search" },
      { label: "Project management", href: "/how-it-works" },
      { label: "Enterprise", href: "/companies" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/how-it-works" },
      { label: "Our mission", href: "/how-it-works" },
      { label: "Careers", href: "/how-it-works" },
      { label: "Press", href: "/how-it-works" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help center", href: "/faq" },
      { label: "Trust & safety", href: "/privacy-policy" },
      { label: "Contact us", href: "/faq" },
      { label: "Privacy policy", href: "/privacy-policy" },
    ],
  },
];

const SOCIALS = [
  {
    label: "X",
    href: "https://x.com",
    path: "M18.9 2H22l-7.1 8.1L23 22h-6.6l-5.2-6.8L5.3 22H2.2l7.6-8.7L1.7 2h6.8l4.7 6.2L18.9 2Zm-1.1 18h1.7L7.3 3.8H5.5L17.8 20Z",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    path: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.6c0-1.34-.03-3.06-1.9-3.06-1.9 0-2.2 1.46-2.2 2.96V21h-4V9Z",
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    path: "M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.8-1.8C19.3 5 12 5 12 5s-7.3 0-8.8.5A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.8 1.8C4.7 19 12 19 12 19s7.3 0 8.8-.5a2.5 2.5 0 0 0 1.8-1.8C23 15.2 23 12 23 12ZM9.8 15.2V8.8l6 3.2-6 3.2Z",
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    path: "M12 2c2.7 0 3 0 4.1.06 1.1.05 1.8.22 2.4.47.65.25 1.2.6 1.75 1.13.53.55.88 1.1 1.13 1.75.25.6.42 1.3.47 2.4C22 8.99 22 9.3 22 12s0 3-.06 4.1c-.05 1.1-.22 1.8-.47 2.4a4.8 4.8 0 0 1-1.13 1.75c-.55.53-1.1.88-1.75 1.13-.6.25-1.3.42-2.4.47C15 22 14.7 22 12 22s-3 0-4.1-.06c-1.1-.05-1.8-.22-2.4-.47a4.8 4.8 0 0 1-1.75-1.13 4.8 4.8 0 0 1-1.13-1.75c-.25-.6-.42-1.3-.47-2.4C2 15 2 14.7 2 12s0-3 .06-4.1c.05-1.1.22-1.8.47-2.4A4.8 4.8 0 0 1 3.66 3.75 4.8 4.8 0 0 1 5.4 2.62c.6-.25 1.3-.42 2.4-.47C8.99 2 9.3 2 12 2Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm5.2-8.4a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-cloud">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-6 text-gray-500">
              The marketplace for podcast talent. From creators to brands, we help great podcasts happen.
            </p>
          </div>
          {GROUPS.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-semibold text-ink">{group.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-gray-500 transition hover:text-teal">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-mist hover:text-teal"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
