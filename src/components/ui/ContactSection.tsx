import { Envelope, LinkedinLogo, GithubLogo, ArrowRight } from "@phosphor-icons/react/dist/ssr";

export function ContactSection() {
  const links = [
    { icon: <Envelope size={15} />, label: "dat@realitech.dev", href: "mailto:dat@realitech.dev", external: false },
    { icon: <LinkedinLogo size={15} />, label: "LinkedIn", href: "https://linkedin.com/in/datngo", external: true },
    { icon: <GithubLogo size={15} />, label: "GitHub", href: "https://github.com/datngo", external: true },
  ];

  return (
    <section className="pt-8 border-t border-[#E9E9E9]">
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">Liên hệ</p>
      <div className="flex flex-col gap-2 max-w-md">
        {links.map(({ icon, label, href, external }) => (
          <a
            key={href}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="group flex items-center justify-between px-4 py-3 bg-white border border-[#E9E9E9] rounded-xl text-sm text-neutral-600 hover:border-neutral-300 hover:text-neutral-900 transition-all"
          >
            <span className="flex items-center gap-2.5">
              <span className="text-neutral-400 group-hover:text-neutral-700 transition-colors">{icon}</span>
              {label}
            </span>
            <ArrowRight size={13} className="text-neutral-300 group-hover:text-neutral-600 transition-colors" />
          </a>
        ))}
      </div>
    </section>
  );
}
