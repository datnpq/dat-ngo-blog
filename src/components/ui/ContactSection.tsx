import { Envelope, LinkedinLogo, GithubLogo, ArrowRight } from "@phosphor-icons/react/dist/ssr";

export function ContactSection() {
  const links = [
    { icon: <Envelope size={15} />, label: "dat@realitech.dev", href: "mailto:dat@realitech.dev", external: false },
    { icon: <LinkedinLogo size={15} />, label: "LinkedIn", href: "https://linkedin.com/in/datngo", external: true },
    { icon: <GithubLogo size={15} />, label: "GitHub", href: "https://github.com/datngo", external: true },
  ];

  return (
    <section className="pt-8 border-t border-border">
      <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Liên hệ</p>
      <div className="flex flex-col gap-2 max-w-md">
        {links.map(({ icon, label, href, external }) => (
          <a
            key={href}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="group flex items-center justify-between px-4 py-3 bg-card border border-border rounded-xl text-sm text-ink-secondary hover:border-border-hover hover:text-ink transition-all"
          >
            <span className="flex items-center gap-2.5">
              <span className="text-ink-muted group-hover:text-ink transition-colors">{icon}</span>
              {label}
            </span>
            <ArrowRight size={13} className="text-ink-muted group-hover:text-ink transition-colors" />
          </a>
        ))}
      </div>
    </section>
  );
}
