import type { Metadata } from "next";
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Projects — dat.ngo",
  description:
    "Các dự án nổi bật của Nguyễn Phạm Quốc Đạt — từ REALITECH WebAR platform đến WeDev studio và các sản phẩm thương mại điện tử.",
  openGraph: {
    title: "Projects — dat.ngo",
    description: "Các dự án nổi bật của Nguyễn Phạm Quốc Đạt.",
    url: "https://dat.ngo/projects",
    type: "website",
    images: [{ url: "https://dat.ngo/og?title=Projects&subtitle=dat.ngo" }],
  },
  alternates: { canonical: "https://dat.ngo/projects" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Projects by Nguyễn Phạm Quốc Đạt",
  url: "https://dat.ngo/projects",
  itemListElement: [
    { "@type": "SoftwareApplication", name: "REALITECH", url: "https://realitech.vn", applicationCategory: "WebAR Platform" },
    { "@type": "SoftwareApplication", name: "WeDev", applicationCategory: "Software Studio" },
  ],
};

interface Project {
  name: string;
  role: string;
  roleColor: string;
  period: string;
  status: "active" | "completed";
  description: string;
  highlights: string[];
  tags: string[];
  link?: string;
  linkLabel?: string;
}

const projects: Project[] = [
  {
    name: "REALITECH",
    role: "Co-Founder & CTO",
    roleColor: "bg-blue-50 text-blue-700 border-blue-100",
    period: "2022 – nay",
    status: "active",
    description:
      "WebAR no-code platform giúp SMEs và enterprises tại Đông Nam Á tạo và triển khai trải nghiệm Augmented Reality trực tiếp trên trình duyệt — không cần tải app.",
    highlights: [
      "100+ thương hiệu đã sử dụng platform",
      "Try-on AR cho jewelry, fashion, furniture",
      "Zero-install, chạy trên mọi thiết bị",
    ],
    tags: ["WebAR", "WebXR", "React", "Node.js", "PostgreSQL", "Three.js"],
    link: "https://realitech.vn",
    linkLabel: "realitech.vn",
  },
  {
    name: "WeDev",
    role: "Founder",
    roleColor: "bg-violet-50 text-violet-700 border-violet-100",
    period: "2021 – nay",
    status: "active",
    description:
      "Software engineering studio hợp tác với startups và doanh nghiệp để thiết kế, xây dựng và vận hành các sản phẩm kỹ thuật số chất lượng cao — từ architecture đến production.",
    highlights: [
      "20+ dự án đã deliver",
      "Chuyên Next.js, Node.js, React Native",
      "Đối tác tin cậy cho 5+ startup Series A",
    ],
    tags: ["Full-stack", "System Design", "TypeScript", "Next.js", "React Native"],
    link: "https://wedev.vn",
    linkLabel: "wedev.vn",
  },
  {
    name: "Patronus Jewelry",
    role: "Lead Engineer",
    roleColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
    period: "2023 – 2024",
    status: "completed",
    description:
      "Nền tảng e-commerce end-to-end cho thương hiệu trang sức cao cấp, tích hợp product customization 3D/AR, thanh toán Stripe, và headless storefront tối ưu conversion.",
    highlights: [
      "Tích hợp WebAR try-on cho 200+ sản phẩm",
      "Tỷ lệ chuyển đổi tăng 3x so với trang cũ",
      "Tích hợp Stripe + VNPay",
    ],
    tags: ["Next.js", "PostgreSQL", "Stripe", "WebAR", "Prisma"],
  },
  {
    name: "Beaudy.vn",
    role: "Full-stack Engineer",
    roleColor: "bg-amber-50 text-amber-700 border-amber-100",
    period: "2022 – 2023",
    status: "completed",
    description:
      "Marketplace làm đẹp kết nối khách hàng với salon và beauty professionals trên toàn Việt Nam — đặt lịch realtime, reviews, và dashboard quản lý cho vendors.",
    highlights: [
      "1,000+ salons trên platform",
      "Booking realtime với Socket.io",
      "Vendor analytics dashboard",
    ],
    tags: ["React", "Node.js", "MongoDB", "Socket.io", "Redis"],
    link: "https://beaudy.vn",
    linkLabel: "beaudy.vn",
  },
  {
    name: "UrBox · Lalamove",
    role: "Software Engineer",
    roleColor: "bg-neutral-100 text-neutral-600 border-neutral-200",
    period: "2019 – 2021",
    status: "completed",
    description:
      "B2B gifting infrastructure tại UrBox và công nghệ logistics last-mile tại Lalamove — làm việc trên high-throughput APIs và distributed service integrations.",
    highlights: [
      "UrBox: xử lý 10,000+ gift orders/ngày",
      "Lalamove: tối ưu dispatch algorithm",
      "Microservices với Go + gRPC",
    ],
    tags: ["Vue.js", "Go", "MySQL", "gRPC", "Kafka"],
  },
];

export default function ProjectsPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="max-w-4xl mx-auto px-5 py-12 sm:py-16">
        <header className="mb-10 pb-8 border-b border-[#E9E9E9]">
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2 tracking-tight">
            Projects
          </h1>
          <p className="text-neutral-500 text-sm max-w-xl">
            Các dự án tiêu biểu tôi đã xây dựng, co-found hoặc contribute — từ product đến engineering.
          </p>
        </header>

        <ul className="space-y-4">
          {projects.map((project) => (
            <li
              key={project.name}
              className="group bg-white border border-[#E9E9E9] rounded-2xl p-6 hover:border-neutral-300 hover:shadow-sm transition-all duration-200"
            >
              {/* Header row */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-[17px] font-bold text-neutral-900">
                    {project.link ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-700 transition-colors inline-flex items-center gap-1.5"
                      >
                        {project.name}
                        <ArrowSquareOut size={14} className="text-neutral-400 group-hover:text-blue-500 transition-colors" />
                      </a>
                    ) : (
                      project.name
                    )}
                  </h3>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${project.roleColor}`}>
                    {project.role}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    project.status === "active"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-neutral-50 text-neutral-400"
                  }`}>
                    {project.status === "active" ? "● Active" : "Completed"}
                  </span>
                </div>
                <span className="text-xs text-neutral-400 font-medium">{project.period}</span>
              </div>

              {/* Description */}
              <p className="text-neutral-500 text-sm leading-relaxed mb-4">
                {project.description}
              </p>

              {/* Highlights */}
              <ul className="space-y-1 mb-4">
                {project.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-neutral-600">
                    <span className="text-blue-400 mt-0.5 shrink-0">→</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              {/* Footer: tags + link */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F5F5F5]">
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 bg-neutral-50 border border-[#EBEBEB] text-neutral-500 text-xs rounded-lg font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
                  >
                    {project.linkLabel ?? project.link}
                    <ArrowSquareOut size={11} />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
