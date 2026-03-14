interface KeyTermsProps {
  children: React.ReactNode;
}

export default function KeyTerms({ children }: KeyTermsProps) {
  return (
    <div className="my-6 rounded-xl border border-border bg-bg p-5">
      <div className="mb-3 text-xs font-heading font-semibold text-muted">📖 מושגי מפתח</div>
      <div className="text-sm leading-relaxed text-text/80 space-y-2">
        {children}
      </div>
    </div>
  );
}
