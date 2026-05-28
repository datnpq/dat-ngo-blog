"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import type { Post } from "@/types/post";

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-sm text-neutral-400">Đang tải...</div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-neutral-900">Bài viết</h1>
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          + Bài viết mới
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">
          <p className="text-sm mb-4">Chưa có bài viết nào.</p>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E9E9E9] text-neutral-700 rounded-xl text-sm font-medium hover:border-neutral-300 transition-all"
          >
            Viết bài đầu tiên
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[#E9E9E9] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-[#E9E9E9]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Tiêu đề</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider w-28">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider w-32">Ngày tạo</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F5]">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="font-medium text-neutral-900 hover:text-blue-600 transition-colors"
                    >
                      {post.title}
                    </Link>
                    <p className="text-xs text-neutral-400 mt-0.5">/blog/{post.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        post.status === "published"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {post.status === "published" ? "Xuất bản" : "Nháp"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-500 text-xs">
                    {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                      >
                        Sửa
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(post)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteTarget && (
        <ConfirmDeleteDialog
          postTitle={deleteTarget.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
