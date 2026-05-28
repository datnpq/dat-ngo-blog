"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex">
      {/* Sidebar */}
      <aside className="w-52 bg-white border-r border-[#E9E9E9] flex flex-col shrink-0">
        <div className="px-4 py-5 border-b border-[#E9E9E9]">
          <Link href="/" className="text-base font-bold text-neutral-900 tracking-tight">
            dat.ngo
          </Link>
          <p className="text-[11px] text-neutral-400 mt-0.5 font-semibold uppercase tracking-wider">CMS</p>
        </div>

        <nav className="flex-1 p-3">
          <ul className="space-y-0.5">
            <li>
              <Link
                href="/admin"
                className={`block px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  pathname === "/admin"
                    ? "bg-blue-50 text-blue-700"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                }`}
              >
                Tất cả bài viết
              </Link>
            </li>
            <li>
              <Link
                href="/admin/posts/new"
                className={`block px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  pathname === "/admin/posts/new"
                    ? "bg-blue-50 text-blue-700"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                }`}
              >
                + Bài viết mới
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-3 border-t border-[#E9E9E9]">
          <Link
            href="/blog"
            className="block px-3 py-2 text-sm text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 rounded-xl transition-colors mb-0.5"
          >
            ↗ Xem blog
          </Link>
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 text-sm text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 rounded-xl transition-colors text-left"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
