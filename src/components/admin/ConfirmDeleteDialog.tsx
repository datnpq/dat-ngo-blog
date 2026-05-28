"use client";

interface ConfirmDeleteDialogProps {
  postTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDeleteDialog({
  postTitle,
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDeleteDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-[#E9E9E9] shadow-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-base font-bold text-neutral-900 mb-2">Xóa bài viết</h2>
        <p className="text-sm text-neutral-500 mb-1">
          Bạn có chắc chắn muốn xóa bài viết:
        </p>
        <p className="text-sm font-semibold text-neutral-900 mb-3 px-3 py-2 bg-neutral-50 rounded-xl border border-[#E9E9E9]">
          &quot;{postTitle}&quot;
        </p>
        <p className="text-xs text-red-600 mb-6">
          Hành động này không thể hoàn tác.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-[#E9E9E9] rounded-xl hover:border-neutral-300 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Đang xóa..." : "Xóa bài viết"}
          </button>
        </div>
      </div>
    </div>
  );
}
