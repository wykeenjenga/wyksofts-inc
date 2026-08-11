import type { Metadata } from "next";
import { MarketingPage } from "../components/MarketingPage";
import { process, services } from "../data/site";

export const metadata: Metadata = { title: "Software Development Services | WykSofts Inc.", description: "Mobile apps, websites, custom software, APIs, AI, and cloud engineering from WykSofts Inc." };

export default function ServicesPage() {
  return (
    <MarketingPage eyebrow="Services" title="Digital products, designed and engineered as one." intro="From a focused website to an operationally important product, we combine strategy, interface design, and dependable software engineering.">
      <section className="services section">
        <div className="service-list">{services.map((service) => <article className="service-row" key={service.number}><span className="service-number">{service.number}</span><h3>{service.title}</h3><p>{service.description}</p><div className="service-tags">{service.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><span className="service-arrow" aria-hidden="true">↗</span></article>)}</div>
      </section>
      <section className="approach section">
        <div className="approach-intro"><p className="section-kicker light">How we work</p><h2>Clear thinking. Close collaboration. No black box.</h2><p>You stay close to the work through visible progress, honest trade-offs, and decisions tied to business outcomes.</p></div>
        <ol className="process-list">{process.map((item, index) => <li key={item.step}><span>0{index + 1}</span><div><h3>{item.step}</h3><p>{item.text}</p></div></li>)}</ol>
      </section>
    </MarketingPage>
  );
}
