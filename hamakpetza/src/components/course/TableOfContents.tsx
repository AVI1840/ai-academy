'use client';

import { useState, useEffect } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u0590-\u05FF-]/g, '')
    .slice(0, 60);
}

export default function TableOfContents() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLHeadingElement>('article h2, article h3')
    );

    // Assign ids if missing
    headings.forEach(el => {
      if (!el.id) {
        el.id = slugify(el.textContent ?? '');
      }
    });

    const tocItems: TocItem[] = headings
      .filter(el => el.id)
      .map(el => ({
        id: el.id,
        text: el.textContent?.replace(/^#+\s*/, '') ?? '',
        level: el.tagName === 'H2' ? 2 : 3,
      }));

    setItems(tocItems);

    if (tocItems.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-10% 0px -80% 0px' }
    );

    headings.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (items.length < 3) return null;

  return (
    <nav
      aria-label="תוכן העניינים"
      className="fixed left-4 top-24 z-20 w-44 hidden 2xl:block"
    >
      <p className="text-[10px] font-heading font-bold text-muted uppercase tracking-wider mb-2 px-1">
        תוכן
      </p>
      <div className="max-h-[70vh] overflow-y-auto space-y-0.5">
        {items.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`block text-[11px] leading-snug py-1 px-1 rounded transition-colors truncate
              ${item.level === 3 ? 'ps-3' : ''}
              ${activeId === item.id
                ? 'text-accent font-semibold'
                : 'text-muted/60 hover:text-muted'
              }`}
          >
            {item.text}
          </a>
        ))}
      </div>
    </nav>
  );
}
