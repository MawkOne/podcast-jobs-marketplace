import Link from "next/link";
import Logo from "@/components/Logo";

const NAV = [
  { label: "Find Producers", href: "/talent/search/podcast_producer" },
  { label: "Job Board", href: "/job/search" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4">
        <Link href="/" aria-label="Podwave home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-500 transition hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/talent/search"
            aria-label="Search"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-50 hover:text-ink sm:flex"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </Link>
          <Link
            href="/login"
            className="hidden text-sm font-medium text-gray-500 transition hover:text-ink sm:block"
          >
            Log in
          </Link>
          <Link href="/signup" className="pw-btn pw-btn-secondary px-4 py-2 text-sm">
            Sign Up
          </Link>
          <Link href="/hire" className="pw-btn pw-btn-primary hidden px-4 py-2 text-sm sm:inline-flex">
            Post a Job
          </Link>
        </div>
      </div>
    </header>
  );
}
