const SIZES = {
  sm: "h-9 w-9 text-[11px]",
  md: "h-12 w-12 text-sm",
  lg: "h-16 w-16 text-lg",
} as const;

type AvatarProps = {
  src: string | null;
  fallback: string;
  alt: string;
  size?: keyof typeof SIZES;
};

/** Avatar with the initials-tile fallback (G3). */
export default function Avatar({ src, fallback, alt, size = "md" }: AvatarProps) {
  const base = `flex shrink-0 items-center justify-center rounded-full font-semibold ${SIZES[size]}`;
  if (src) {
    return <img src={src} alt={alt} className={`${base} object-cover ring-1 ring-gray-200`} />;
  }
  return (
    <div title={alt} className={`${base} bg-mist text-teal`}>
      {fallback}
    </div>
  );
}
