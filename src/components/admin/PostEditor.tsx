"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { generateSlug, isValidSlug } from "@/lib/slug";
import { TiptapEditor } from "./TiptapEditor";
import type { Post, CreatePostInput, PostLanguage, PostStatus } from "@/types/post";

interface PostEditorProps {
  post?: Post;
}

interface FormErrors {
  title?: string;
  slug?: string;
  body?: string;
  general?: string;
}

const inputClass =
  "w-full px-3 py-2 border border-[#E9E9E9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white";

const labelClass = "block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-1.5";

export function PostEditor({ post }: PostEditorProps) {
  const router = useRouter();
  const isEdit = !!post;

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [tags, setTags] = useState(post?.tags?.join(", ") ?? "");
  const [featuredImageUrl, setFeaturedImageUrl] = useState(post?.featuredImageUrl ?? "");
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(post?.seoDescription ?? "");
  const [language, setLanguage] = useState<PostLanguage>(post?.language ?? "vi");
  const [status, setStatus] = useState<PostStatus>(post?.status ?? "draft");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEdit);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  const autoSlug = useCallback(
    (t: string) => {
      if (!slugManuallyEdited) setSlug(generateSlug(t));
    },
    [slugManuallyEdited]
  );

  useEffect(() => {
    autoSlug(title);
  }, [title, autoSlug]);

  function validateForm(): FormErrors {
    const errs: FormErrors = {};
    if (!title.trim()) errs.title = "Tiêu đề không được để trống";
    if (!body.trim()) errs.body = "Nội dung không được để trống";
    if (!slug) {
      errs.slug = "Slug không được để trống";
    } else if (!isValidSlug(slug)) {
      errs.slug = "Slug chỉ được chứa chữ thường, số và dấu gạch ngang";
    }
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateForm();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);

    const payload: Partial<CreatePostInput> = {
      title: title.trim(),
      slug,
      body,
      excerpt: excerpt.trim() || undefined,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      featuredImageUrl: featuredImageUrl.trim() || undefined,
      seoTitle: seoTitle.trim() || undefined,
      seoDescription: seoDescription.trim() || undefined,
      language,
      status,
    };

    try {
      const url = isEdit ? `/api/posts/${post.id}` : "/api/posts";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.field ? { [data.field]: data.error } : { general: data.error || "Có lỗi xảy ra khi lưu bài viết." });
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setErrors({ general: "Không thể kết nối đến server. Vui lòng thử lại." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E9E9E9]">
        <h1 className="text-xl font-bold text-neutral-900">
          {isEdit ? "Chỉnh sửa bài viết" : "Bài viết mới"}
        </h1>
        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PostStatus)}
            className="px-3 py-1.5 border border-[#E9E9E9] rounded-lg text-sm text-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="draft">Nháp</option>
            <option value="published">Xuất bản</option>
          </select>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Đang lưu..." : isEdit ? "Cập nhật" : "Lưu bài viết"}
          </button>
        </div>
      </div>

      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {errors.general}
        </div>
      )}

      {/* Title */}
      <div>
        <label className={labelClass}>
          Tiêu đề <span className="text-red-500 normal-case">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          className={`${inputClass} text-base font-semibold`}
          placeholder="Tiêu đề bài viết..."
        />
        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
      </div>

      {/* Slug */}
      <div>
        <label className={labelClass}>Slug <span className="text-red-500 normal-case">*</span></label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400 whitespace-nowrap">dat.ngo/blog/</span>
          <input
            type="text"
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugManuallyEdited(true); }}
            className={`${inputClass} font-mono`}
            placeholder="url-slug-cua-bai-viet"
          />
        </div>
        {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug}</p>}
      </div>

      {/* Body — Tiptap */}
      <div>
        <label className={labelClass}>Nội dung <span className="text-red-500 normal-case">*</span></label>
        <TiptapEditor value={body} onChange={setBody} error={errors.body} />
      </div>

      {/* Excerpt */}
      <div>
        <label className={labelClass}>Tóm tắt <span className="text-neutral-400 normal-case font-normal">(tùy chọn)</span></label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          maxLength={300}
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder="Tóm tắt ngắn hiển thị trong danh sách bài viết..."
        />
        <p className="mt-1 text-xs text-neutral-400">{excerpt.length}/300</p>
      </div>

      {/* Tags */}
      <div>
        <label className={labelClass}>Tags</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className={inputClass}
          placeholder="WebAR, AI, Engineering, Founder..."
        />
        <p className="mt-1 text-xs text-neutral-400">Phân cách bằng dấu phẩy</p>
      </div>

      {/* Language */}
      <div>
        <label className={labelClass}>Ngôn ngữ</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as PostLanguage)}
          className={inputClass}
        >
          <option value="vi">Tiếng Việt</option>
          <option value="en">English</option>
        </select>
      </div>

      {/* Featured Image */}
      <div>
        <label className={labelClass}>Ảnh đại diện (URL)</label>
        <input
          type="url"
          value={featuredImageUrl}
          onChange={(e) => setFeaturedImageUrl(e.target.value)}
          maxLength={2048}
          className={inputClass}
          placeholder="https://..."
        />
      </div>

      {/* SEO */}
      <div className="border border-[#E9E9E9] rounded-2xl p-5 space-y-4 bg-neutral-50">
        <p className={`${labelClass} mb-0`}>SEO <span className="text-neutral-400 normal-case font-normal">(tùy chọn)</span></p>

        <div>
          <label className={labelClass}>SEO Title</label>
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            maxLength={60}
            className={inputClass}
            placeholder="Tiêu đề xuất hiện trong kết quả tìm kiếm..."
          />
          <p className="mt-1 text-xs text-neutral-400">{seoTitle.length}/60</p>
        </div>

        <div>
          <label className={labelClass}>SEO Description</label>
          <textarea
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            maxLength={160}
            rows={2}
            className={`${inputClass} resize-none`}
            placeholder="Mô tả ngắn cho Google Search..."
          />
          <p className="mt-1 text-xs text-neutral-400">{seoDescription.length}/160</p>
        </div>
      </div>
    </form>
  );
}
