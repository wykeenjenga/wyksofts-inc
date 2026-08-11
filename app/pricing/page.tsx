import type { Metadata } from "next";
import { MarketingPage } from "../components/MarketingPage";
import { QuoteBuilder } from "../components/QuoteBuilder";

export const metadata: Metadata = { title: "Pricing & Quotations | WykSofts Inc.", description: "Explore WykSofts project starting points and request a tailored software quotation." };

export default function PricingPage() {
  return (
    <MarketingPage eyebrow="Pricing" title="A clear starting point. A quotation shaped around the work." intro="Focused landing-page work starts from $100. Larger websites, applications, and software products are scoped around outcomes, complexity, timing, and support.">
      <section className="pricing section"><QuoteBuilder /></section>
    </MarketingPage>
  );
}
