/** Minimal eight-point star (Rub el Hizb) mark drawn with thin strokes. */
export function AppMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none" stroke="currentColor">
      <g className="text-gold" strokeWidth="1.5" strokeLinejoin="round">
        <rect x="8" y="8" width="16" height="16" />
        <rect x="8" y="8" width="16" height="16" transform="rotate(45 16 16)" />
        <circle cx="16" cy="16" r="3.2" />
      </g>
    </svg>
  );
}
