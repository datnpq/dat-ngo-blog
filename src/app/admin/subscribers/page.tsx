"use client";

import { useEffect, useState } from "react";

interface Subscriber {
  id: string;
  email: string;
  status: string;
  source: string | null;
  created_at: string;
}

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/subscribers");
        if (res.ok) {
          const data = await res.json();
          setSubscribers(data.subscribers ?? []);
          setActiveCount(data.activeCount ?? 0);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function exportCsv() {
    const header = "email,status,source,created_at";
    const rows = subscribers.map(
      (s) => `${s.email},${s.status},${s.source ?? ""},${s.created_at}`
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return <div className="p-8 text-sm text-neutral-400">Đang tải...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Subscribers</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            {activeCount} người đang đăng ký · {subscribers.length} tổng
          </p>
        </div>
        {subscribers.length > 0 && (
          <button
            onClick={exportCsv}
            className="px-4 py-2 bg-white border border-[#E9E9E9] text-neutral-700 text-sm font-medium rounded-xl hover:border-neutral-300 transition-all"
          >
            Xuất CSV
          </button>
        )}
      </div>

      {subscribers.length === 0 ? (
        <div className="text-center py-16 text-neutral-400 text-sm">
          Chưa có ai đăng ký.
        </div>
      ) : (
        <div className="bg-white border border-[#E9E9E9] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-[#E9E9E9]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider w-28">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider w-28">Nguồn</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider w-32">Ngày</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F5]">
              {subscribers.map((s) => (
                <tr key={s.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-neutral-900">{s.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        s.status === "active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {s.status === "active" ? "Đang theo dõi" : "Đã hủy"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-500 text-xs">{s.source ?? "—"}</td>
                  <td className="px-4 py-3 text-neutral-500 text-xs">
                    {new Date(s.created_at).toLocaleDateString("vi-VN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
