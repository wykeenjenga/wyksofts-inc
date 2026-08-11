import type { ReactNode } from "react";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function MarketingPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return (
    <main className="marketing-page">
      <SiteHeader />
      <section className="page-hero">
        <p className="section-kicker">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
      </section>
      {children}
      <section className="page-cta section">
        <p className="section-kicker light">Ready when you are</p>
        <h2>Bring us the problem. We&apos;ll help shape the path forward.</h2>
        <div><a className="button button-primary" href="/inquiry/">Start a project <span>↗</span></a><a className="text-link" href="/book/">Book a discovery call <span>↗</span></a></div>
      </section>
      <SiteFooter />
    </main>
  );
}
