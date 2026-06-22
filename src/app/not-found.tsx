import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-5 py-32 text-center">
      <p className="text-sm font-semibold text-ink-muted uppercase tracking-widest mb-4">404</p>
      <h1 className="text-4xl font-bold text-ink mb-3 tracking-tight">
        Trang không tồn tại
      </h1>
      <p className="text-ink-muted text-sm mb-10">
        Trang bạn tìm kiếm đã bị xóa hoặc không tồn tại.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-card border border-border text-ink-secondary rounded-xl text-sm font-medium hover:border-border-hover hover:shadow-sm transition-all"
      >
        <ArrowLeft size={14} />
        Về trang chủ
      </Link>
    </div>
  );
}
