/** App logo: eight-point star medallion with "Bismillah", rendered from the app icon. */
export function AppMark({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/icons/icon.svg" alt="" aria-hidden="true" width={32} height={32} className={className} draggable={false} />
  );
}
