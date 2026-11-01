import type { ReactNode } from 'react';

export function Kicker({ children }: { children: ReactNode }) {
  return <p className="kicker mb-4">{children}</p>;
}

export function SlideTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`font-display text-cream font-semibold leading-tight text-3xl md:text-5xl ${className}`}>
      {children}
    </h2>
  );
}

export function SlideShell({ children, center = false }: { children: ReactNode; center?: boolean }) {
  return (
    <div
      className={`w-full max-w-5xl mx-auto px-5 md:px-10 py-8 md:py-12 flex flex-col ${
        center ? 'items-center text-center justify-center' : ''
      }`}
    >
      {children}
    </div>
  );
}

export function Divider() {
  return <div className="h-px w-16 mx-auto my-6" style={{ backgroundColor: 'var(--terra)' }} />;
}

export function Reveal({
  shown,
  onReveal,
  label,
  children,
}: {
  shown: boolean;
  onReveal: () => void;
  label: string;
  children: ReactNode;
}) {
  if (!shown) {
    return (
      <button type="button" className="btn-ghost" onClick={onReveal}>
        {label}
      </button>
    );
  }
  return <div className="step-in">{children}</div>;
}
