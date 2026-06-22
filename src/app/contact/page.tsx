import type { Metadata } from "next";
import { Envelope, LinkedinLogo, GithubLogo, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Contact — dat.ngo",
  description:
    "Liên hệ với Nguyễn Phạm Quốc Đạt — Co-Founder @ REALITECH & Founder @ WeDev. Sẵn sàng kết nối về WebAR, AI và cơ hội hợp tác.",
  openGraph: {
    title: "Contact — dat.ngo",
    description: "Liên hệ với Nguyễn Phạm Quốc Đạt.",
    url: "https://dat.ngo/contact",
    type: "website",
    images: [{ url: "https://dat.ngo/og" }],
  },
  alternates: { canonical: "https://dat.ngo/contact" },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Nguyễn Phạm Quốc Đạt",
  url: "https://dat.ngo",
  email: "dat@realitech.dev",
  sameAs: ["https://linkedin.com/in/datngo", "https://github.com/datngo"],
};

const contactLinks = [
  {
    icon: Envelope,
    label: "Email",
    value: "dat@realitech.dev",
    href: "mailto:dat@realitech.dev",
    description: "Cách liên hệ nhanh nhất — tôi thường trả lời trong vòng 24 giờ.",
    external: false,
  },
  {
    icon: LinkedinLogo,
    label: "LinkedIn",
    value: "linkedin.com/in/datngo",
    href: "https://linkedin.com/in/datngo",
    description: "Kết nối chuyên nghiệp, cập nhật về REALITECH và WeDev.",
    external: true,
  },
  {
    icon: GithubLogo,
    label: "GitHub",
    value: "github.com/datngo",
    href: "https://github.com/datngo",
    description: "Open-source contributions và side projects.",
    external: true,
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={personJsonLd} />

      <div className="max-w-[740px] mx-auto px-5 py-12 sm:py-16">
        <header className="mb-10 pb-8 border-b border-border">
          <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-2 tracking-tight">
            Liên hệ
          </h1>
          <p className="text-ink-secondary text-sm max-w-lg">
            Tôi luôn sẵn sàng trò chuyện về WebAR, Spatial Computing, system architecture, hay bất kỳ cơ hội hợp tác thú vị nào.
          </p>
        </header>

        <div className="space-y-3 mb-10">
          {contactLinks.map(({ icon: Icon, label, value, href, description, external }) => (
            <a
              key={href}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="group flex items-center justify-between p-5 bg-card border border-border rounded-2xl hover:border-border-hover hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5 p-2 bg-elevated border border-[#EBEBEB] rounded-xl text-ink-secondary group-hover:text-ink group-hover:border-border transition-colors">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-ink-muted uppercase tracking-widest mb-0.5">
                    {label}
                  </p>
                  <p className="text-[15px] font-semibold text-ink mb-1">{value}</p>
                  <p className="text-sm text-ink-muted">{description}</p>
                </div>
              </div>
              <ArrowRight
                size={15}
                className="text-ink-muted group-hover:text-ink transition-colors shrink-0 ml-4"
              />
            </a>
          ))}
        </div>

        <div className="p-6 bg-elevated border border-border rounded-2xl">
          <p className="text-sm text-ink-secondary leading-relaxed">
            <span className="font-semibold text-ink">Quan tâm đến hợp tác?</span>{" "}
            Nếu bạn đang xây dựng sản phẩm trong lĩnh vực WebAR/XR, thương mại điện tử, hoặc cần một đối tác kỹ thuật đáng tin cậy — hãy gửi email hoặc nhắn tin qua LinkedIn. Tôi đặc biệt hứng thú với các bài toán ở giao điểm giữa công nghệ không gian, AI, và thị trường Đông Nam Á.
          </p>
        </div>
      </div>
    </>
  );
}
