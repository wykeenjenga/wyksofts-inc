"use client";

import { useState, type FormEvent } from "react";
import { getSupabaseBrowserClient } from "../../lib/supabase";
import { packages } from "../data/site";

export function QuoteBuilder() {
  const [quote, setQuote] = useState({ projectType: packages[0].type, budget: "$100–$500", timeline: "Within 1 month", name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const update = (field: keyof typeof quote, value: string) => setQuote((current) => ({ ...current, [field]: value }));
  const whatsappText = ["Hello WykSofts, I would like a quotation.", "", `Name: ${quote.name || "Not provided"}`, `Email: ${quote.email || "Not provided"}`, `Project type: ${quote.projectType}`, `Budget: ${quote.budget}`, `Timeline: ${quote.timeline}`, `Project details: ${quote.message || "I would like to discuss the requirements."}`].join("\n");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return setStatus("error");
    setStatus("sending");
    const { error } = await supabase.from("wyksofts_inquiries").insert({ name: quote.name.trim(), email: quote.email.trim(), project_type: quote.projectType, budget: quote.budget, timeline: quote.timeline, message: quote.message.trim(), source: "pricing-quotation-builder" });
    if (error) return setStatus("error");
    setStatus("sent");
    setQuote((current) => ({ ...current, name: "", email: "", message: "" }));
  }

  return (
    <>
      <div className="package-grid">
        {packages.map((item, index) => (
          <button className={quote.projectType === item.type ? "package-card active" : "package-card"} type="button" key={item.name} onClick={() => update("projectType", item.type)} aria-pressed={quote.projectType === item.type}>
            <span className="package-number">0{index + 1}</span><h3>{item.name}</h3><strong>{item.price}</strong><p>{item.description}</p>
            <ul>{item.items.map((feature) => <li key={feature}>{feature}</li>)}</ul>
            <span className="package-select">{quote.projectType === item.type ? "Selected" : "Choose package"}</span>
          </button>
        ))}
      </div>
      <div className="quote-builder" id="quote-builder">
        <div className="quote-builder-intro">
          <p className="section-kicker light">Project planner</p><h3>Build your quotation request.</h3>
          <p>Tell us what you need. Your request goes securely into our private review queue.</p>
          <div className="quote-contact-note"><span>Prefer to talk?</span><a href="tel:+254703285070">+254 703 285 070</a></div>
        </div>
        <form className="quote-form" onSubmit={submit}>
          <label>Project type<select value={quote.projectType} onChange={(event) => update("projectType", event.target.value)}>{packages.map((item) => <option key={item.type}>{item.type}</option>)}<option>Maintenance or existing product improvements</option><option>Not sure yet</option></select></label>
          <div className="quote-form-row">
            <label>Approximate budget<select value={quote.budget} onChange={(event) => update("budget", event.target.value)}><option>$100–$500</option><option>$500–$2,000</option><option>$2,000–$5,000</option><option>$5,000+</option><option>Help me estimate</option></select></label>
            <label>Preferred timeline<select value={quote.timeline} onChange={(event) => update("timeline", event.target.value)}><option>Within 1 month</option><option>1–3 months</option><option>3–6 months</option><option>Flexible</option></select></label>
          </div>
          <div className="quote-form-row">
            <label>Your name<input type="text" value={quote.name} onChange={(event) => update("name", event.target.value)} autoComplete="name" required /></label>
            <label>Email address<input type="email" value={quote.email} onChange={(event) => update("email", event.target.value)} autoComplete="email" required /></label>
          </div>
          <label>What would you like to build?<textarea value={quote.message} onChange={(event) => update("message", event.target.value)} placeholder="Share the idea, current problem, important features, and what success looks like." rows={5} required /></label>
          <div className="quote-actions">
            <button className="button quote-button" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Request quotation"}<span aria-hidden="true">↗</span></button>
            <a className="button whatsapp-button" href={`https://wa.me/254703285070?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noreferrer">Continue on WhatsApp <span aria-hidden="true">↗</span></a>
          </div>
          {status === "sent" && <p className="quote-feedback quote-feedback-success" role="status">Thank you—your request is in our review queue. We’ll reply within one business day.</p>}
          {status === "error" && <p className="quote-feedback quote-feedback-error" role="alert">We could not save your request. Please try again or email hello@wyksoftsinc.com.</p>}
          <small>This creates an enquiry, not a binding order. Final pricing depends on scope and requirements.</small>
        </form>
      </div>
    </>
  );
}
