import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  headline: string;
  body?: string;
  /** Render on dark navy sections */
  dark?: boolean;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  headline,
  body,
  dark = false,
  align = "center",
}: SectionHeadingProps) {
  const alignCls = align === "center" ? "mx-auto text-center" : "";
  return (
    <Reveal className={`max-w-3xl ${alignCls}`}>
      {eyebrow && (
        <p
          className={`font-mono text-xs font-medium uppercase tracking-[0.18em] ${
            dark ? "text-green-400" : "text-green-700"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15] ${
          dark ? "text-white" : "text-navy-900"
        }`}
      >
        {headline}
      </h2>
      {body && (
        <p
          className={`mt-5 text-base leading-7 sm:text-lg sm:leading-8 ${
            dark ? "text-white/70" : "text-navy-900/70"
          }`}
        >
          {body}
        </p>
      )}
    </Reveal>
  );
}
