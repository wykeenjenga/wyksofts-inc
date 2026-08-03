"use client";

import { useRef, useState, type FormEvent } from "react";
import { PortalHeader } from "../components/PortalHeader";
import { getSupabaseBrowserClient } from "../../lib/supabase";

const projectTypes = [
  "Mobile application",
  "Website or web platform",
  "Custom software",
  "API or system integration",
  "AI or cloud solution",
  "Existing product improvement",
  "Not sure yet",
];

export default function InquiryPage() {
  const startedAt = useRef(Date.now());
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);

    if (values.get("website") || Date.now() - startedAt.current < 2500) return;

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setStatus("error");
      setErrorMessage("Online submissions are being connected. Please email hello@wyksoftsinc.com for now.");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    const { error } = await supabase.from("wyksofts_inquiries").insert({
      name: String(values.get("name") ?? "").trim(),
      email: String(values.get("email") ?? "").trim(),
      phone: String(values.get("phone") ?? "").trim() || null,
      company: String(values.get("company") ?? "").trim() || null,
      project_type: String(values.get("projectType") ?? ""),
      budget: String(values.get("budget") ?? ""),
      timeline: String(values.get("timeline") ?? ""),
      message: String(values.get("message") ?? "").trim(),
      source: "website-inquiry-page",
    });

    if (error) {
      setStatus("error");
      setErrorMessage("We could not send your inquiry. Please try again or email hello@wyksoftsinc.com.");
      return;
    }

    form.reset();
    setStatus("sent");
  }

  return (
    <main className="portal-page">
      <PortalHeader label="Start a project" />
      <section className="portal-hero">
        <div>
          <p className="section-kicker">Project inquiry</p>
          <h1>Tell us what you want to build.</h1>
        </div>
        <p>
          Share the problem, ambition, and timing. We’ll review it personally and
          reply with useful next steps—usually within one business day.
        </p>
      </section>

      <section className="portal-content inquiry-layout">
        <aside className="portal-sidebar">
          <span className="portal-step">01 / Your idea</span>
          <h2>A useful brief starts with the outcome.</h2>
          <p>You do not need a finished specification. Clear context is enough to begin.</p>
          <dl className="portal-contact-list">
            <div><dt>Email</dt><dd><a href="mailto:hello@wyksoftsinc.com">hello@wyksoftsinc.com</a></dd></div>
            <div><dt>Phone</dt><dd><a href="tel:+254703285070">+254 703 285 070</a></dd></div>
            <div><dt>Based in</dt><dd>Mirage Towers, Nairobi</dd></div>
          </dl>
        </aside>

        {status === "sent" ? (
          <div className="portal-success" role="status">
            <span>✓</span>
            <p className="section-kicker">Inquiry received</p>
            <h2>Thank you. We’ll be in touch.</h2>
            <p>Your project is now in our review queue. Expect a response within one business day.</p>
            <a className="button button-primary" href="/">Return to WykSofts <span>↗</span></a>
          </div>
        ) : (
          <form className="portal-form" onSubmit={submitInquiry}>
            <div className="portal-form-grid">
              <label>Full name<input name="name" autoComplete="name" required /></label>
              <label>Work email<input name="email" type="email" autoComplete="email" required /></label>
              <label>Phone number <span>Optional</span><input name="phone" type="tel" autoComplete="tel" /></label>
              <label>Company <span>Optional</span><input name="company" autoComplete="organization" /></label>
              <label>What can we help with?<select name="projectType" defaultValue="" required><option value="" disabled>Select a project type</option>{projectTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
              <label>Approximate budget<select name="budget" defaultValue="" required><option value="" disabled>Select a range</option><option>$100–$500</option><option>$500–$2,000</option><option>$2,000–$5,000</option><option>$5,000–$15,000</option><option>$15,000+</option><option>Help me estimate</option></select></label>
              <label>Preferred timeline<select name="timeline" defaultValue="" required><option value="" disabled>Select timing</option><option>As soon as possible</option><option>Within 1 month</option><option>1–3 months</option><option>3–6 months</option><option>Flexible</option></select></label>
            </div>
            <label className="portal-message">Project details<textarea name="message" rows={7} required placeholder="What are you trying to achieve? Who will use it? What would make this project successful?" /></label>
            <label className="portal-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
            <label className="portal-consent"><input type="checkbox" required /><span>I agree that WykSofts may use these details to respond to my inquiry.</span></label>
            {status === "error" && <p className="portal-error" role="alert">{errorMessage}</p>}
            <button className="portal-submit" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send project inquiry"}<span aria-hidden="true">↗</span></button>
            <small>This is an inquiry, not a binding order. We never sell your information.</small>
          </form>
        )}
      </section>
    </main>
  );
}
