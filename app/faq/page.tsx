import type { Metadata } from "next";
import { MarketingPage } from "../components/MarketingPage";
import { faqs } from "../data/site";

export const metadata: Metadata = { title: "Frequently Asked Questions | WykSofts Inc.", description: "Answers about WykSofts pricing, timelines, ownership, support, confidentiality, and remote collaboration." };

export default function FaqPage() {
  return (
    <MarketingPage eyebrow="Frequently asked questions" title="Good questions deserve clear answers." intro="The practical details on pricing, timelines, ownership, support, and working with WykSofts.">
      <section className="faq faq-page-content section"><div className="faq-heading"><p>Need an answer specific to your project? <a href="/book/">Book a short discovery call.</a></p></div><div className="faq-list">{faqs.map((item, index) => <details key={item.question} open={index === 0}><summary><span>0{index + 1}</span>{item.question}<b aria-hidden="true">+</b></summary><p>{item.answer}</p></details>)}</div></section>
    </MarketingPage>
  );
}
