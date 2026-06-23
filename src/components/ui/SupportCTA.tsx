import { Coffee, Heart } from "@phosphor-icons/react/dist/ssr";

/**
 * Lightweight monetization CTA. Renders only the links you configure via env:
 *   NEXT_PUBLIC_KOFI_URL, NEXT_PUBLIC_PATREON_URL, NEXT_PUBLIC_BMC_URL
 * If none are set, the component renders nothing.
 */
export function SupportCTA() {
  const kofi = process.env.NEXT_PUBLIC_KOFI_URL;
  const patreon = process.env.NEXT_PUBLIC_PATREON_URL;
  const bmc = process.env.NEXT_PUBLIC_BMC_URL;

  const links = [
    kofi && { label: "Ko-fi", href: kofi, Icon: Coffee },
    bmc && { label: "Buy me a coffee", href: bmc, Icon: Coffee },
    patreon && { label: "Patreon", href: patreon, Icon: Heart },
  ].filter(Boolean) as { label: string; href: string; Icon: typeof Coffee }[];

  if (links.length === 0) return null;

  return (
    <div className="mt-12 p-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl text-center">
      <p className="font-bold text-neutral-900 mb-1">Thấy bài viết hữu ích?</p>
      <p className="text-sm text-neutral-500 mb-4">
        Ủng hộ để mình tiếp tục viết những nội dung chất lượng.
      </p>
      <div className="flex flex-wrap justify-center gap-2.5">
        {links.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-amber-200 text-neutral-800 rounded-xl text-sm font-medium hover:border-amber-300 transition-colors"
          >
            <Icon size={16} weight="fill" className="text-amber-500" />
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
