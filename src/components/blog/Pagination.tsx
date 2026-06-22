import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export function Pagination({ currentPage, totalPages, basePath = "/blog" }: PaginationProps) {
  if (totalPages <= 1) return null;

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;
  const pageUrl = (page: number) => (page === 1 ? basePath : `${basePath}?page=${page}`);

  return (
    <nav className="flex items-center justify-between pt-8 mt-4 border-t border-border" aria-label="Pagination">
      {prevPage ? (
        <Link
          href={pageUrl(prevPage)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-ink-secondary bg-card border border-border rounded-xl hover:border-border-hover hover:text-ink transition-all"
        >
          <ArrowLeft size={14} />
          Trang trước
        </Link>
      ) : (
        <span className="flex items-center gap-2 px-4 py-2 text-sm text-ink-muted bg-elevated border border-border rounded-xl cursor-not-allowed">
          <ArrowLeft size={14} />
          Trang trước
        </span>
      )}

      <span className="text-sm text-ink-muted">
        {currentPage} / {totalPages}
      </span>

      {nextPage ? (
        <Link
          href={pageUrl(nextPage)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-ink-secondary bg-card border border-border rounded-xl hover:border-border-hover hover:text-ink transition-all"
        >
          Trang sau
          <ArrowRight size={14} />
        </Link>
      ) : (
        <span className="flex items-center gap-2 px-4 py-2 text-sm text-ink-muted bg-elevated border border-border rounded-xl cursor-not-allowed">
          Trang sau
          <ArrowRight size={14} />
        </span>
      )}
    </nav>
  );
}
