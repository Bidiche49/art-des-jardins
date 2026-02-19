import Link from 'next/link';
import { IconPhone } from '@/lib/icons';

export function MobileStickyBar() {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-3">
      <div className="flex gap-3">
        <a
          href="tel:+33781160737"
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-800 rounded-lg font-medium text-sm"
          aria-label="Appeler Art des Jardins"
        >
          <IconPhone className="w-4 h-4" />
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
