import type { Metadata } from "next";
import { MarketingPage } from "../components/MarketingPage";

export const metadata: Metadata = { title: "Terms, Privacy & Policies | WykSofts Inc.", description: "WykSofts Inc. terms of engagement, cancellation, privacy, support, confidentiality, and security policies." };

const policies = [
  { title: "Terms of engagement", paragraphs: ["Work begins after scope, deliverables, responsibilities, timeline, and payment milestones are agreed. Requests outside that scope are estimated and approved before they are added.", "Unless an agreement says otherwise, ownership of custom work transfers after full payment. Third-party software, fonts, services, and open-source components remain subject to their own licences."] },
  { title: "Project cancellation", paragraphs: ["Either party may request cancellation in writing. The final account will cover work completed, approved milestones, and non-recoverable third-party costs committed for the project.", "Paid-for work and available project materials are handed over in a reasonable format. Any unused balance or outstanding amount is handled according to the accepted quotation or agreement."] },
  { title: "Privacy & data", paragraphs: ["We use information you send us to respond to enquiries, prepare quotations, deliver agreed work, and manage legitimate business records. We collect only what is necessary and do not sell personal information.", "Inquiry, quotation, discovery-call, and application details are stored securely for authorized review. Privacy questions can be sent to hello@wyksoftsinc.com."] },
  { title: "Support & warranties", paragraphs: ["Testing, launch support, defect correction periods, maintenance, and service levels are defined per project. Ongoing support is available through a separate maintenance plan.", "We cannot guarantee uninterrupted operation of third-party services, but we communicate issues clearly and help identify practical next steps."] },
  { title: "Confidentiality & security", paragraphs: ["Project access is limited to people involved in delivery. Credentials and sensitive configuration should be shared through agreed secure channels and kept out of public repositories.", "Environment separation, backups, access reviews, handover, and credential rotation are agreed according to each project. Reasonable non-disclosure agreements can be reviewed before sensitive discovery."] },
];

export default function PoliciesPage() {
  return (
    <MarketingPage eyebrow="Working together" title="Clear expectations make better projects." intro="These summaries explain our usual way of working. Your accepted quotation, statement of work, or agreement takes priority where terms differ.">
      <section className="policies policies-page-content section"><div className="policies-intro"><span className="policy-date">Last updated 11 August 2026</span><p>Questions about a current agreement? Email <a href="mailto:hello@wyksoftsinc.com">hello@wyksoftsinc.com</a>.</p></div><div className="policy-list">{policies.map((policy, index) => <details key={policy.title} open={index === 0}><summary><span>0{index + 1}</span>{policy.title}<b aria-hidden="true">+</b></summary><div>{policy.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></details>)}</div></section>
    </MarketingPage>
  );
}
