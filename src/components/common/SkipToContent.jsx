export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100]
                 focus:rounded-xl focus:bg-emerald-deep focus:text-white focus:px-4 focus:py-2
                 focus:text-sm focus:font-medium focus:shadow-card"
    >
      Lompat ke konten utama
    </a>
  );
}