import Link from 'next/link';

export function MobileStickyBar() {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-3">
      <div className="flex gap-3">
        <a
          href="tel:+33781160737"
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-800 rounded-lg font-medium text-sm"
          aria-label="Appeler Art des Jardins"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Appeler
        </a>
        <Link
          href="/contact/"
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-600 text-white rounded-lg font-medium text-sm"
        >
          Devis gratuit
        </Link>
      </div>
    </div>
  );
}
