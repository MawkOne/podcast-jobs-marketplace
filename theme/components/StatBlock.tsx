type StatBlockProps = {
  value: string;
  label: string;
};

/** Stat — big number over a quiet label. */
export default function StatBlock({ value, label }: StatBlockProps) {
  return (
    <div>
      <p className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </div>
  );
}
