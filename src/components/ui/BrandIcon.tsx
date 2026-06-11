import Image from "next/image";

export type BrandIconName =
  | "data"
  | "jurisdictional"
  | "audit"
  | "landowners"
  | "buyers"
  | "brokers"
  | "legal-regulatory"
  | "geographical"
  | "co2"
  | "decarbonization"
  | "dmrv"
  | "governments"
  | "information"
  | "hierarchy"
  | "mission"
  | "asset-management"
  | "intelligences"
  | "services"
  | "project-developers"
  | "funders"
  | "financial"
  | "exchange"
  | "insurance"
  | "badges"
  | "nesting"
  | "academy"
  | "money"
  | "price";

type BrandIconProps = {
  name: BrandIconName;
  /** Chip background. White brand icons need a colored fill behind them. */
  tone?: "green" | "blue" | "navy";
  size?: "md" | "lg";
  className?: string;
};

const tones = {
  green: "bg-green-500",
  blue: "bg-blue-600",
  navy: "bg-navy-800",
};

const sizes = {
  md: { chip: "h-12 w-12 rounded-xl", icon: 26 },
  lg: { chip: "h-16 w-16 rounded-2xl", icon: 34 },
};

/** White brand icon on a rounded brand-color chip (brand rule: rounded-corner squares). */
export function BrandIcon({ name, tone = "green", size = "md", className = "" }: BrandIconProps) {
  const s = sizes[size];
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${s.chip} ${tones[tone]} ${className}`}
    >
      <Image
        src={`/icons/${name}.webp`}
        alt=""
        aria-hidden
        width={s.icon}
        height={s.icon}
        className="object-contain"
      />
    </span>
  );
}
