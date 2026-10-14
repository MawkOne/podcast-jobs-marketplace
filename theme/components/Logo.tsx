import { SITE_NAME } from "@/lib/seo";

type LogoProps = {
  className?: string;
};

/** Podwave mark — a simplified waveform/equalizer symbol + geometric wordmark. */
export default function Logo({ className = "" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 28 28" className="h-7 w-7 text-teal" aria-hidden>
        <g fill="currentColor">
          <rect x="2" y="11" width="2.6" height="6" rx="1.3" />
          <rect x="7.2" y="7" width="2.6" height="14" rx="1.3" />
          <rect x="12.4" y="3" width="2.6" height="22" rx="1.3" />
          <rect x="17.6" y="8" width="2.6" height="12" rx="1.3" />
          <rect x="22.8" y="12" width="2.6" height="4" rx="1.3" />
        </g>
      </svg>
      <span className="text-lg font-bold tracking-tight text-ink">{SITE_NAME}</span>
    </span>
  );
}
