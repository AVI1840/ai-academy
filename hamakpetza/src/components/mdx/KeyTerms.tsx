interface KeyTermsProps {
  children: React.ReactNode;
}

export default function KeyTerms({ children }: KeyTermsProps) {
  return (
    <section
      className="my-6 rounded-xl border border-accent/20 bg-accent-light/30 p-5"
      role="region"
      aria-label="מושגי מפתח"
    >
      <div
        className="mb-3 text-xs font-heading font-semibold text-accent"
        aria-hidden="true"
      >
        מושגי מפתח
      </div>
      <dl className="text-sm leading-relaxed text-text/80 space-y-2 [&>ul]:list-none [&>ul]:ps-0 [&>ul]:space-y-2 [&_li]:ps-0">
        {children}
      </dl>
    </section>
  );
}
