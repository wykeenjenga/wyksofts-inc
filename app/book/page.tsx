"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { PortalHeader } from "../components/PortalHeader";
import { getSupabaseBrowserClient } from "../../lib/supabase";

const callTimes = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

const timeZones = [
  "Africa/Nairobi (EAT, UTC+3)",
  "Europe/London (GMT/BST)",
  "Europe/Paris (CET/CEST)",
  "America/New_York (ET)",
  "America/Chicago (CT)",
  "America/Denver (MT)",
  "America/Los_Angeles (PT)",
  "Asia/Dubai (GST, UTC+4)",
  "Asia/Kolkata (IST, UTC+5:30)",
  "Other — include it in your note",
];

export default function BookDiscoveryCallPage() {
  const startedAt = useRef<number | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const now = new Date();
    if (dateInputRef.current) {
      dateInputRef.current.min = new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
        .toISOString()
        .slice(0, 10);
    }
  }, []);

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);

    if (
      values.get("website") ||
      (startedAt.current !== null && Date.now() - startedAt.current < 2500)
    ) return;

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setStatus("error");
      setErrorMessage("Online booking is temporarily unavailable. Please email hello@wyksoftsinc.com.");
      return;
    }

    const preferredDate = String(values.get("preferredDate") ?? "");
    const preferredTime = String(values.get("preferredTime") ?? "");
    const timeZone = String(values.get("timeZone") ?? "");
    const callFormat = String(values.get("callFormat") ?? "");
    const agenda = String(values.get("agenda") ?? "").trim();

    setStatus("sending");
    setErrorMessage("");

    const { error } = await supabase.from("wyksofts_inquiries").insert({
      name: String(values.get("name") ?? "").trim(),
      email: String(values.get("email") ?? "").trim(),
      phone: String(values.get("phone") ?? "").trim() || null,
      company: String(values.get("company") ?? "").trim() || null,
      project_type: "Discovery call",
      budget: "To discuss",
      timeline: `${preferredDate} at ${preferredTime} · ${timeZone}`,
      message: `Preferred call format: ${callFormat}\n\nWhat they would like to discuss:\n${agenda}`,
      source: "discovery-call-booking",
    });

    if (error) {
      setStatus("error");
      setErrorMessage("We could not save your call request. Please try again or email hello@wyksoftsinc.com.");
      return;
    }

    form.reset();
    setStatus("sent");
  }

  return (
    <main className="portal-page booking-page">
      <PortalHeader label="Discovery call" />
      <section className="portal-hero booking-hero">
        <div>
          <p className="section-kicker">30-minute introduction</p>
          <h1>Let&apos;s find the clearest next move.</h1>
        </div>
        <p>
          Choose a time that works for you and tell us what is on your mind.
          We&apos;ll confirm the meeting by email—usually within one business day.
        </p>
      </section>

      <section className="portal-content inquiry-layout booking-layout">
        <aside className="portal-sidebar">
          <span className="portal-step">01 / Pick a time</span>
          <h2>A focused conversation, no hard sell.</h2>
          <p>
            We&apos;ll discuss your goals, what may be getting in the way, and whether
            WykSofts is the right partner for the next step.
          </p>
          <dl className="portal-contact-list">
            <div><dt>Duration</dt><dd>30 minutes</dd></div>
            <div><dt>Format</dt><dd>Google Meet, Zoom, phone, or WhatsApp</dd></div>
            <div><dt>Response</dt><dd>Confirmation within one business day</dd></div>
          </dl>
        </aside>

        {status === "sent" ? (
          <div className="portal-success" role="status">
            <span>✓</span>
            <p className="section-kicker">Call requested</p>
            <h2>Your preferred time is with us.</h2>
            <p>
              We&apos;ll review your request and send the confirmed meeting details to
              your email within one business day.
            </p>
            <Link className="button button-primary" href="/">Return to WykSofts <span>↗</span></Link>
          </div>
        ) : (
          <form
            className="portal-form booking-form"
            onFocusCapture={() => {
              if (startedAt.current === null) startedAt.current = Date.now();
            }}
            onSubmit={submitBooking}
          >
            <div className="booking-form-heading">
              <p className="section-kicker">Your details</p>
              <h2>Request your discovery call.</h2>
              <p>This is a time request. We&apos;ll email you once the meeting is confirmed.</p>
            </div>
            <div className="portal-form-grid">
              <label>Full name<input name="name" autoComplete="name" required /></label>
              <label>Work email<input name="email" type="email" autoComplete="email" required /></label>
              <label>Phone or WhatsApp <span>Optional</span><input name="phone" type="tel" autoComplete="tel" /></label>
              <label>Company <span>Optional</span><input name="company" autoComplete="organization" /></label>
              <label>Preferred date<input ref={dateInputRef} name="preferredDate" type="date" required /></label>
              <label>Preferred time<select name="preferredTime" defaultValue="" required><option value="" disabled>Select a time</option>{callTimes.map((time) => <option key={time} value={time}>{time}</option>)}</select></label>
              <label>Time zone<select name="timeZone" defaultValue="Africa/Nairobi (EAT, UTC+3)" required>{timeZones.map((zone) => <option key={zone}>{zone}</option>)}</select></label>
              <label>Call format<select name="callFormat" defaultValue="Google Meet" required><option>Google Meet</option><option>Zoom</option><option>Phone call</option><option>WhatsApp call</option></select></label>
            </div>
            <label className="portal-message">What would you like to discuss?<textarea name="agenda" rows={6} minLength={10} required placeholder="A short overview of your idea, challenge, or product is perfect." /></label>
            <label className="portal-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
            <label className="portal-consent"><input type="checkbox" required /><span>I agree that WykSofts may use these details to arrange and respond to my discovery call.</span></label>
            {status === "error" && <p className="portal-error" role="alert">{errorMessage}</p>}
            <button className="portal-submit orange" type="submit" disabled={status === "sending"}>{status === "sending" ? "Requesting…" : "Request discovery call"}<span aria-hidden="true">↗</span></button>
            <small>No payment is required. Your requested time is confirmed only after you receive our email.</small>
          </form>
        )}
      </section>
    </main>
  );
}
