import type { ReactNode } from "react";

const TONES = {
  gray: "bg-cloud text-gray-600",
  indigo: "bg-mist text-teal",
  accent: "bg-mist text-teal",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
} as const;

type BadgeProps = {
  children: ReactNode;
  tone?: keyof typeof TONES;
};

export default function Badge({ children, tone = "gray" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${TONES[tone]}`}>
      {children}
    </span>
  );
}
