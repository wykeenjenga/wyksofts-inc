"use client";

import { useRef, useState, type FormEvent } from "react";
import { PortalHeader } from "../components/PortalHeader";
import { getSupabaseBrowserClient } from "../../lib/supabase";

const roles = [
  { title: "Software Engineer", type: "Open application", detail: "Web, mobile, backend, integrations, or cloud engineering." },
  { title: "Product Designer", type: "Open application", detail: "UX thinking, interface craft, prototyping, and product systems." },
  { title: "QA Engineer", type: "Open application", detail: "Thoughtful testing, release confidence, and quality advocacy." },
  { title: "Project Delivery", type: "Open application", detail: "Planning, communication, coordination, and dependable delivery." },
];

export default function CareersPage() {
  const startedAt = useRef(Date.now());
  const [selectedRole, setSelectedRole] = useState("Software Engineer");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    if (values.get("website") || Date.now() - startedAt.current < 2500) return;

    const supabase = getSupabaseBrowserClient();
    if (!supabase) { setStatus("error"); return; }
    setStatus("sending");

    const { error } = await supabase.from("wyksofts_job_applications").insert({
      role: selectedRole,
      name: String(values.get("name") ?? "").trim(),
      email: String(values.get("email") ?? "").trim(),
      phone: String(values.get("phone") ?? "").trim() || null,
      location: String(values.get("location") ?? "").trim() || null,
      linkedin_url: String(values.get("linkedin") ?? "").trim() || null,
      github_url: String(values.get("github") ?? "").trim() || null,
      portfolio_url: String(values.get("portfolio") ?? "").trim() || null,
      resume_url: String(values.get("resume") ?? "").trim() || null,
      years_experience: String(values.get("experience") ?? ""),
      cover_note: String(values.get("coverNote") ?? "").trim(),
    });

    if (error) { setStatus("error"); return; }
    form.reset();
    setStatus("sent");
  }

  return (
    <main className="portal-page careers-page">
      <PortalHeader label="Careers" />
      <section className="portal-hero careers-portal-hero">
        <div><p className="section-kicker">Build with us</p><h1>Do work that moves people forward.</h1></div>
        <p>WykSofts is building a high-trust team of people who care about useful products, excellent craft, and leaving things better than they found them.</p>
      </section>

      <section className="culture-strip" aria-label="What we value">
        <span>Curiosity</span><span>Ownership</span><span>Craft</span><span>Clarity</span><span>Respect</span>
      </section>

      <section className="portal-content careers-content">
        <div className="roles-heading"><p className="section-kicker">Areas of interest</p><h2>Find your place in the work.</h2><p>We may not have an immediate vacancy in every discipline, but strong applications stay on our radar as the team grows.</p></div>
        <div className="role-grid">
          {roles.map((role, index) => (
            <button key={role.title} type="button" className={selectedRole === role.title ? "role-card active" : "role-card"} onClick={() => { setSelectedRole(role.title); document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" }); }}>
              <span>0{index + 1}</span><small>{role.type}</small><h3>{role.title}</h3><p>{role.detail}</p><b>Apply for this area ↘</b>
            </button>
          ))}
        </div>
      </section>

      <section className="application-section" id="apply">
        <div className="application-intro"><p className="section-kicker light">Application</p><h2>Show us how you think.</h2><p>Selected area</p><strong>{selectedRole}</strong><p>Share links that demonstrate your work. A résumé link is welcome, but your explanation of what you built and learned matters just as much.</p></div>
        {status === "sent" ? (
          <div className="portal-success dark" role="status"><span>✓</span><p className="section-kicker light">Application received</p><h2>Thanks for introducing yourself.</h2><p>We’ll review your application and contact you when there is a relevant opportunity.</p></div>
        ) : (
          <form className="portal-form dark-form" onSubmit={submitApplication}>
            <div className="portal-form-grid">
              <label>Full name<input name="name" autoComplete="name" required /></label>
              <label>Email address<input name="email" type="email" autoComplete="email" required /></label>
              <label>Phone <span>Optional</span><input name="phone" type="tel" autoComplete="tel" /></label>
              <label>Location <span>Optional</span><input name="location" autoComplete="address-level2" /></label>
              <label>Years of experience<select name="experience" defaultValue="" required><option value="" disabled>Select experience</option><option>Student / entry level</option><option>1–3 years</option><option>4–6 years</option><option>7–10 years</option><option>10+ years</option></select></label>
              <label>LinkedIn <span>Optional</span><input name="linkedin" type="url" placeholder="https://linkedin.com/in/…" /></label>
              <label>GitHub <span>Optional</span><input name="github" type="url" placeholder="https://github.com/…" /></label>
              <label>Portfolio <span>Optional</span><input name="portfolio" type="url" placeholder="https://…" /></label>
              <label>Résumé link <span>Optional</span><input name="resume" type="url" placeholder="Google Drive, Dropbox, or portfolio link" /></label>
            </div>
            <label className="portal-message">Why WykSofts, and what are you proud of?<textarea name="coverNote" rows={7} required placeholder="Tell us what you enjoy building, the kind of problems you solve well, and one piece of work you are proud of." /></label>
            <label className="portal-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
            <label className="portal-consent"><input type="checkbox" required /><span>I agree that WykSofts may retain these details for suitable career opportunities.</span></label>
            {status === "error" && <p className="portal-error" role="alert">Online applications are being connected. Please email your application to hello@wyksoftsinc.com.</p>}
            <button className="portal-submit orange" type="submit" disabled={status === "sending"}>{status === "sending" ? "Submitting…" : "Submit application"}<span>↗</span></button>
            <small>Applications are reviewed privately and do not guarantee immediate employment.</small>
          </form>
        )}
      </section>
    </main>
  );
}
