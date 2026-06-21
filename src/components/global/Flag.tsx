import {
  AE,
  AU,
  BR,
  CA,
  CH,
  CL,
  CN,
  CO,
  DE,
  EU,
  GB,
  ID,
  IN,
  JP,
  KR,
  KZ,
  MX,
  MY,
  NZ,
  PH,
  PT,
  SG,
  TH,
  TR,
  US,
  VN,
  ZA,
} from "country-flag-icons/react/3x2";

type FlagComponent = (props: { className?: string; title?: string }) => React.JSX.Element;

const FLAGS: Record<string, FlagComponent> = {
  AE, AU, BR, CA, CH, CL, CN, CO, DE, EU, GB, ID, IN, JP, KR, KZ,
  MX, MY, NZ, PH, PT, SG, TH, TR, US, VN, ZA,
};

/**
 * Sharp-cornered country flag in a hairline frame — matches the instrument look.
 * Subnational jurisdictions pass the national `cc` and carry their name in the label.
 */
export function Flag({
  cc,
  title,
  className = "",
}: {
  cc: string;
  title?: string;
  className?: string;
}) {
  const Svg = FLAGS[cc];
  if (!Svg) {
    return (
      <span
        aria-label={title}
        className={`inline-flex items-center justify-center bg-navy-900/10 font-mono text-[8px] text-navy-900/60 ${className}`}
      >
        {cc}
      </span>
    );
  }
  return (
    <span
      className={`inline-block overflow-hidden rounded-[1px] ring-1 ring-navy-900/15 ${className}`}
    >
      <Svg title={title} className="h-full w-full object-cover" />
    </span>
  );
}
