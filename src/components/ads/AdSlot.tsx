import * as React from "react";

type Props = {
  id: string;
  className?: string;
  ratio?: "banner"|"rect"|"skyscraper"|"square"|"custom";
  height?: number;
  imageUrl?: string;
  href?: string;
  alt?: string;
  html?: string;
  showPlaceholder?: boolean;
};

const R: Record<NonNullable<Props["ratio"]>, string> = {
  banner: "w-full h-24 sm:h-28",
  rect: "w-full h-48",
  skyscraper: "w-72 h-[600px]",
  square: "w-64 h-64",
  custom: ""
};

export default function AdSlot({
  id, className="", ratio="banner", height,
  imageUrl, href, alt="Publicidad",
  html, showPlaceholder=false
}: Props) {
  const [visible, setVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true);
    }, { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const disabled = process.env.NEXT_PUBLIC_ADS_ENABLED === "false";
  const style = ratio === "custom" && height ? { height } : undefined;
  const cls = `relative overflow-hidden rounded-xl border bg-white/60 ${R[ratio]} ${className}`;

  return (
    <div ref={ref} className={cls} style={style} data-ad-slot={id}>
      {!visible || disabled ? (showPlaceholder ? <Placeholder label={id} /> : null)
      : html ? (<div className="w-full h-full" dangerouslySetInnerHTML={{ __html: html }} />)
      : imageUrl ? (
          <a href={href || "#"} target="_blank" rel="noopener" className="block w-full h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={alt} className="w-full h-full object-cover" />
          </a>
        )
      : (showPlaceholder ? <Placeholder label={id} /> : null)}
    </div>
  );
}

function Placeholder({ label }:{label:string}) {
  return (
    <div className="flex items-center justify-center w-full h-full bg-[repeating-linear-gradient(45deg,#f6f6f6,#f6f6f6_10px,#efefef_10px,#efefef_20px)] text-gray-500 text-xs">
      Espacio publicitario • {label}
    </div>
  );
}
