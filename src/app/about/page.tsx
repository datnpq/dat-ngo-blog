import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Envelope, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";
import { JsonLd } from "@/components/seo/JsonLd";
import { MotionFigure } from "@/components/ui/MotionFigure";

export const metadata: Metadata = {
  title: "About — dat.ngo",
  description:
    "Nguyễn Phạm Quốc Đạt — Co-Founder @ REALITECH & Founder @ WeDev. Hành trình từ BD đến Entrepreneur và Engineer trong lĩnh vực WebAR/XR.",
  openGraph: {
    title: "About — dat.ngo",
    description: "Nguyễn Phạm Quốc Đạt — Co-Founder @ REALITECH & Founder @ WeDev.",
    url: "https://dat.ngo/about",
    type: "profile",
    images: [{ url: "https://dat.ngo/og" }],
  },
  alternates: { canonical: "https://dat.ngo/about" },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Nguyễn Phạm Quốc Đạt",
  url: "https://dat.ngo",
  image: "https://dat.ngo/og",
  jobTitle: "Co-Founder at REALITECH & Founder at WeDev",
  description: "Co-Founder @ REALITECH (WebAR no-code platform) & Founder @ WeDev. Viết về Spatial Computing, WebAR/XR, AI và System Architecture.",
  email: "dat@realitech.dev",
  knowsAbout: ["WebAR", "Spatial Computing", "System Architecture", "AI", "Full-stack"],
  sameAs: ["https://linkedin.com/in/datngo", "https://github.com/datngo"],
  worksFor: [
    { "@type": "Organization", name: "REALITECH", url: "https://realitech.dev" },
    { "@type": "Organization", name: "WeDev" },
  ],
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={personJsonLd} />

      <div className="max-w-[740px] mx-auto px-5 py-12 sm:py-16">
        {/* Profile header */}
        <header className="mb-12 pb-12 border-b border-border">
          <div className="flex items-start gap-5 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-lg font-bold text-white shrink-0 select-none">
              ĐN
            </div>
            <div>
              <h1 className="text-2xl font-bold text-ink mb-1 tracking-tight">
                Nguyễn Phạm Quốc Đạt
              </h1>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20 text-xs font-medium border border-blue-100">
                  Co-Founder @ REALITECH
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/20 text-xs font-medium border border-violet-100">
                  Founder @ WeDev
                </span>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-ink-muted">
                <a href="mailto:dat@realitech.dev" className="flex items-center gap-1.5 hover:text-ink transition-colors">
                  <Envelope size={14} /> dat@realitech.dev
                </a>
                <a href="https://linkedin.com/in/datngo" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-ink transition-colors">
                  <LinkedinLogo size={14} /> LinkedIn
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {["WebAR/XR", "Full-stack", "System Architecture", "AI applications", "SEA Market"].map((skill) => (
              <span key={skill} className="px-3 py-1 bg-card border border-border text-ink-secondary text-xs rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </header>

        {/* Speaking photo */}
        <figure className="mb-12">
          <MotionFigure className="overflow-hidden rounded-2xl border border-border bg-elevated">
            <Image
              src="/about/speaking-nwos.jpg"
              alt="Nguyễn Phạm Quốc Đạt thuyết trình về 'Why XR Adoption Struggles' tại sự kiện Next Wave of Startups"
              width={1600}
              height={1067}
              sizes="(max-width: 768px) 100vw, 740px"
              className="w-full h-auto"
              priority
            />
          </MotionFigure>
          <figcaption className="mt-3 text-center text-xs text-ink-muted">
            Chia sẻ về &ldquo;Why XR Adoption Struggles&rdquo; tại Next Wave of Startups.
          </figcaption>
        </figure>

        {/* Content */}
        <div className="space-y-10 text-[15px] text-ink-secondary leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-ink mb-4">Cội nguồn &amp; Bước ngoặt</h2>
            <div className="space-y-4">
              <p>
                Tôi lớn lên với niềm đam mê kinh doanh hơn là kỹ thuật. Những năm đầu sau đại học, tôi tập trung vào phát triển kinh doanh — học cách đọc thị trường, thuyết phục khách hàng, và xây dựng mối quan hệ đối tác. Thế giới công nghệ lúc ấy với tôi vẫn còn là một hộp đen.
              </p>
              <p>
                Bước ngoặt đến khi tôi bắt đầu cộng tác với các nhóm kỹ thuật tại một startup fintech. Lần đầu tiên tôi cảm nhận được sự khác biệt giữa một người chỉ "bán sản phẩm" và một người thực sự "hiểu sản phẩm mình bán". Nhận ra khoảng cách đó, tôi quyết định học lập trình — không phải để trở thành developer chuyên nghiệp, mà để nói chuyện được với kỹ sư bằng ngôn ngữ của họ. Nhưng kỹ thuật đã hút tôi vào sâu hơn tôi từng nghĩ.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink mb-4">Hành trình BD → Entrepreneur → Engineer</h2>
            <div className="space-y-4">
              <p>
                REALITECH ra đời từ một bài toán thực tế: doanh nghiệp vừa và nhỏ tại Đông Nam Á muốn ứng dụng WebAR vào marketing và bán hàng, nhưng chi phí phát triển tùy chỉnh quá cao và quy trình quá phức tạp. Chúng tôi xây dựng một nền tảng no-code cho phép bất kỳ ai — dù không biết code — cũng có thể tạo trải nghiệm Augmented Reality trực tiếp trên trình duyệt. Với vai trò Co-Founder &amp; CTO, tôi dẫn dắt kiến trúc kỹ thuật, xây dựng đội ngũ engineering, và trực tiếp viết code trên những module lõi của hệ thống.
              </p>
              <p>
                Song song đó, WeDev được thành lập như một studio kỹ thuật phần mềm — nơi tôi và đội ngũ cộng tác xây dựng các sản phẩm kỹ thuật số từ đầu đến cuối cho các khách hàng như Patronus Jewelry, Beaudy.vn. Trải qua cả UrBox lẫn Lalamove ở vai trò engineer, tôi hiểu rõ hơn cách các hệ thống B2B quy mô lớn vận hành trong môi trường production thực tế.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink mb-4">Triết lý làm việc và Tầm nhìn</h2>
            <div className="space-y-4">
              <p>
                Tôi tin rằng kỹ thuật tốt nhất là kỹ thuật vô hình — người dùng cuối không nên cảm thấy sự tồn tại của hạ tầng bên dưới. Điều đó có nghĩa là viết code có thể bảo trì được, thiết kế hệ thống có thể mở rộng được, và không bao giờ đánh đổi độ tin cậy lấy tốc độ phát triển ngắn hạn. <em>Simplicity is the ultimate sophistication.</em>
              </p>
              <p>
                Về tầm nhìn dài hạn, tôi tin Spatial Computing và WebAR sẽ thay đổi căn bản cách con người tương tác với thông tin và thương mại trong thập kỷ tới. Blog này là nơi tôi ghi lại những suy nghĩ, thử nghiệm, và bài học trên hành trình đó.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-surface rounded-xl text-sm font-semibold hover:bg-ink-secondary transition-colors"
          >
            Liên hệ <ArrowRight size={14} />
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-card border border-border text-ink-secondary rounded-xl text-sm font-medium hover:border-border-hover hover:bg-elevated transition-all"
          >
            Xem projects
          </Link>
        </div>
      </div>
    </>
  );
}
