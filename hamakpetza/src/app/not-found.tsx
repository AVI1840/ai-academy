import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center reading-column">
        <h1 className="font-heading text-6xl font-black text-accent mb-4">404</h1>
        <p className="text-lg text-text mb-2 font-heading">הדף לא נמצא</p>
        <p className="text-muted mb-8">הדף שחיפשת לא קיים או שהכתובת שגויה.</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-xl bg-accent text-white font-heading font-semibold
                     hover:bg-accent/90 transition-colors"
        >
          חזרה לדף הבית →
        </Link>
      </div>
    </div>
  );
}
