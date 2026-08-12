"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { BrandMark } from "../components/BrandMark";
import { PortalHeader } from "../components/PortalHeader";
import { getSupabaseBrowserClient } from "../../lib/supabase";

type Inquiry = {
  id: string; created_at: string; name: string; email: string; phone: string | null;
  company: string | null; project_type: string; budget: string; timeline: string;
  message: string; status: string; admin_notes: string | null;
};

type Application = {
  id: string; created_at: string; name: string; email: string; phone: string | null;
  location: string | null; role: string; years_experience: string; linkedin_url: string | null;
  github_url: string | null; portfolio_url: string | null; resume_url: string | null;
  cover_note: string; status: string; admin_notes: string | null;
};

type WebsiteVisit = {
  id: number; visited_at: string; session_id: string; path: string;
  referrer_domain: string | null; device_type: "desktop" | "mobile" | "tablet";
  utm_source: string | null; utm_campaign: string | null;
};

type RecordItem = Inquiry | Application;
type AdminTab = "overview" | "inquiries" | "applications" | "analytics";
const statuses = ["new", "reviewing", "contacted", "shortlisted", "closed"];

export default function AdminPage() {
  const supabase = getSupabaseBrowserClient();
  const [authState, setAuthState] = useState<"loading" | "signed-out" | "admin" | "denied" | "setup">(supabase ? "loading" : "setup");
  const [tab, setTab] = useState<AdminTab>("overview");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [visits, setVisits] = useState<WebsiteVisit[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [resetState, setResetState] = useState<"idle" | "sending" | "sent" | "rate-limited" | "error">("idle");
  const [resetError, setResetError] = useState("");

  useEffect(() => {
    if (!supabase) return;
    void checkAccess();
    const { data } = supabase.auth.onAuthStateChange(() => void checkAccess());
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    const recovery = new URLSearchParams(window.location.search).get("recovery");
    if (recovery === "expired" || recovery === "invalid") {
      setResetError("Your previous recovery link could not be used. Select Forgot password? to request a fresh WykSofts email.");
      setResetState("error");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  async function checkAccess() {
    if (!supabase) return;
    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims) { setAuthState("signed-out"); return; }
    if (String(data.claims.email ?? "").toLowerCase() !== "hello@wyksoftsinc.com") { setAuthState("denied"); return; }
    setAuthState("admin");
    await loadRecords();
  }

  async function loadRecords() {
    if (!supabase) return;
    setLoading(true);
    const analyticsSince = new Date(Date.now() - 90 * 86400000).toISOString();
    const [inquiryResult, applicationResult, visitResult] = await Promise.all([
      supabase.from("wyksofts_inquiries").select("*").order("created_at", { ascending: false }),
      supabase.from("wyksofts_job_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("wyksofts_website_visits").select("*").gte("visited_at", analyticsSince).order("visited_at", { ascending: false }).limit(5000),
    ]);
    if (!inquiryResult.error) setInquiries(inquiryResult.data as Inquiry[]);
    if (!applicationResult.error) setApplications(applicationResult.data as Application[]);
    if (!visitResult.error) setVisits(visitResult.data as WebsiteVisit[]);
    setLoading(false);
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    const values = new FormData(event.currentTarget);
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({
      email: String(values.get("email") ?? ""),
      password: String(values.get("password") ?? ""),
    });
    if (error) setAuthError("The email or password was not accepted.");
  }

  async function requestPasswordReset() {
    if (!supabase || resetState === "sending") return;
    setResetState("sending");
    setResetError("");
    setAuthError("");

    const { error } = await supabase.auth.resetPasswordForEmail(
      "hello@wyksoftsinc.com",
      { redirectTo: "https://wyksoftsinc.com/admin/reset-password/" },
    );

    if (!error) {
      setResetState("sent");
      return;
    }

    if (error.status === 429 || error.code === "over_email_send_rate_limit") {
      setResetError("No new email was sent. The temporary mail service has reached its hourly allowance. Check Inbox, Spam, or Junk for the earlier message from noreply@mail.app.supabase.io. If it is missing, WykSofts email delivery must be connected before another reset can be sent.");
      setResetState("rate-limited");
      return;
    }

    setResetError("We could not send the reset email. Please try again shortly.");
    setResetState("error");
  }

  async function updateRecord(item: RecordItem, patch: { status?: string; admin_notes?: string | null }) {
    if (!supabase) return;
    const table = tab === "inquiries" ? "wyksofts_inquiries" : "wyksofts_job_applications";
    const { error } = await supabase.from(table).update({ ...patch, updated_at: new Date().toISOString() }).eq("id", item.id);
    if (!error) await loadRecords();
  }

  const records = tab === "applications" ? applications : inquiries;
  const visibleRecords = useMemo(() => records.filter((record) => {
    const haystack = `${record.name} ${record.email} ${"company" in record ? record.company ?? "" : record.role}`.toLowerCase();
    return (filter === "all" || record.status === filter) && haystack.includes(search.toLowerCase());
  }), [records, filter, search]);
  const selected = records.find((record) => record.id === selectedId) ?? visibleRecords[0] ?? null;
  const analytics = useMemo(() => buildAnalytics(visits, inquiries, applications), [visits, inquiries, applications]);

  function switchTab(next: AdminTab) {
    setTab(next);
    setSelectedId(null);
    setSearch("");
    setFilter("all");
  }

  function exportCsv(kind: "inquiries" | "applications" | "visits") {
    const rows = kind === "inquiries" ? inquiries : kind === "applications" ? applications : visits;
    if (!rows.length) return;
    const columns = Object.keys(rows[0]);
    const csv = [columns.join(","), ...rows.map((row) => columns.map((column) => csvCell(String((row as unknown as Record<string, unknown>)[column] ?? ""))).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `wyksofts-${kind}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (authState !== "admin") {
    return (
      <main className="portal-page admin-page">
        <PortalHeader label="Admin" />
        <section className="admin-login-wrap">
          <div className="admin-login-copy"><p className="section-kicker">Private workspace</p><h1>WykSofts Admin</h1><p>Review project inquiries and career applications from one focused workspace.</p></div>
          <div className="admin-login-card">
            {authState === "setup" ? <><h2>Connect Supabase</h2><p>Add the project URL and publishable key to enable secure admin access.</p></> : authState === "denied" ? <><h2>Access restricted</h2><p>This account is signed in but does not have WykSofts administrator access.</p><button className="portal-submit" onClick={() => supabase?.auth.signOut()}>Sign out</button></> : <form onSubmit={login}><BrandMark className="admin-lock" /><h2>Secure sign in</h2><p>Authorized WykSofts administrators only.</p><label>Email<input name="email" type="email" autoComplete="email" defaultValue="hello@wyksoftsinc.com" required /></label><label>Password<input name="password" type="password" autoComplete="current-password" required /></label><button className="admin-forgot" type="button" onClick={() => void requestPasswordReset()} disabled={resetState === "sending" || resetState === "sent" || resetState === "rate-limited"}>{resetState === "sending" ? "Sending reset link…" : resetState === "sent" ? "Reset request accepted" : resetState === "rate-limited" ? "Email limit reached" : "Forgot password?"}</button>{authError && <p className="portal-error">{authError}</p>}{resetState === "sent" && <p className="admin-reset-notice" role="status">Reset request accepted for hello@wyksoftsinc.com. Check Inbox, Spam, and Junk for a message from noreply@mail.app.supabase.io.</p>}{(resetState === "error" || resetState === "rate-limited") && <p className="portal-error" role="alert">{resetError}</p>}<button className="portal-submit" type="submit">Enter dashboard <span>↗</span></button></form>}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a className="brand admin-brand" href="/"><BrandMark /><span>WykSofts</span></a>
        <nav aria-label="Admin navigation">
          <button className={tab === "overview" ? "active" : ""} onClick={() => switchTab("overview")}><span>01</span>Overview <b>Live</b></button>
          <button className={tab === "inquiries" ? "active" : ""} onClick={() => switchTab("inquiries")}><span>02</span>Inquiries <b>{inquiries.length}</b></button>
          <button className={tab === "applications" ? "active" : ""} onClick={() => switchTab("applications")}><span>03</span>Applications <b>{applications.length}</b></button>
          <button className={tab === "analytics" ? "active" : ""} onClick={() => switchTab("analytics")}><span>04</span>Website visits <b>{analytics.visits30}</b></button>
        </nav>
        <div className="admin-sidebar-bottom"><a href="/" target="_blank">View website ↗</a><button onClick={() => supabase?.auth.signOut()}>Sign out</button></div>
      </aside>
      <section className="admin-main">
        <header className="admin-topbar"><div><p className="section-kicker">WykSofts command centre</p><h1>{tab === "overview" ? "Business overview" : tab === "inquiries" ? "Project inquiries" : tab === "applications" ? "Career applications" : "Website analytics"}</h1></div><div className="admin-top-actions">{tab === "inquiries" && <button onClick={() => exportCsv("inquiries")}>Export CSV ↓</button>}{tab === "applications" && <button onClick={() => exportCsv("applications")}>Export CSV ↓</button>}{tab === "analytics" && <button onClick={() => exportCsv("visits")}>Export CSV ↓</button>}<button onClick={loadRecords} disabled={loading}>{loading ? "Refreshing…" : "Refresh ↻"}</button></div></header>

        {tab === "overview" && <Overview analytics={analytics} inquiries={inquiries} applications={applications} onOpen={switchTab} />}
        {tab === "analytics" && <AnalyticsPanel analytics={analytics} />}

        {(tab === "inquiries" || tab === "applications") && <>
          <div className="admin-tools"><label><span>Search</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, email, or company" /></label><label><span>Status</span><select value={filter} onChange={(e) => setFilter(e.target.value)}><option value="all">All statuses</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label></div>
          <div className="admin-workspace">
            <div className="record-list">
              {visibleRecords.length === 0 ? <div className="admin-empty"><span>00</span><h2>No records found.</h2><p>New submissions will appear here automatically.</p></div> : visibleRecords.map((record) => (
                <button key={record.id} className={selected?.id === record.id ? "record-row active" : "record-row"} onClick={() => setSelectedId(record.id)}>
                  <span className={`status-dot status-${record.status}`} /><div><strong>{record.name}</strong><small>{"project_type" in record ? record.project_type : record.role}</small></div><time>{new Date(record.created_at).toLocaleDateString("en-KE", { day: "2-digit", month: "short" })}</time>
                </button>
              ))}
            </div>
            <aside className="record-detail">
              {selected ? <RecordDetail key={selected.id} item={selected} kind={tab} onUpdate={updateRecord} /> : <div className="admin-empty"><span>↖</span><h2>Select a record.</h2></div>}
            </aside>
          </div>
        </>}
      </section>
    </main>
  );
}

type AnalyticsSummary = ReturnType<typeof buildAnalytics>;

function Overview({ analytics, inquiries, applications, onOpen }: { analytics: AnalyticsSummary; inquiries: Inquiry[]; applications: Application[]; onOpen: (tab: AdminTab) => void }) {
  const recent = [...inquiries.map((item) => ({ ...item, kind: "Inquiry" })), ...applications.map((item) => ({ ...item, kind: "Application" }))]
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)).slice(0, 6);
  return <div className="admin-dashboard">
    <section className="admin-metrics" aria-label="Business metrics">
      <Metric label="Visits today" value={analytics.visitsToday} note={`${analytics.visits7} during the last 7 days`} />
      <Metric label="Unique visitors" value={analytics.unique30} note="Last 30 days" />
      <Metric label="Project inquiries" value={inquiries.length} note={`${analytics.newLeads} awaiting review`} />
      <Metric label="Applications" value={applications.length} note={`${analytics.activeApplications} currently active`} />
      <Metric label="Lead conversion" value={`${analytics.conversionRate}%`} note="Inquiries ÷ unique visitors" />
    </section>
    <section className="admin-dashboard-grid">
      <article className="admin-panel admin-traffic-panel">
        <div className="admin-panel-head"><div><p className="section-kicker">Traffic pulse</p><h2>Visits over 14 days</h2></div><button onClick={() => onOpen("analytics")}>Full analytics ↗</button></div>
        <DailyChart days={analytics.daily} />
      </article>
      <article className="admin-panel">
        <div className="admin-panel-head"><div><p className="section-kicker">Popular content</p><h2>Top pages</h2></div></div>
        <RankedList rows={analytics.topPages.slice(0, 5)} empty="No visits recorded yet." />
      </article>
      <article className="admin-panel admin-activity-panel">
        <div className="admin-panel-head"><div><p className="section-kicker">Lead activity</p><h2>Recent submissions</h2></div></div>
        <div className="admin-activity-list">{recent.length ? recent.map((item) => <button key={`${item.kind}-${item.id}`} onClick={() => onOpen(item.kind === "Inquiry" ? "inquiries" : "applications")}><span className={`status-dot status-${item.status}`} /><div><strong>{item.name}</strong><small>{item.kind} · {"project_type" in item ? item.project_type : item.role}</small></div><time>{new Date(item.created_at).toLocaleDateString("en-KE", { day: "2-digit", month: "short" })}</time></button>) : <p className="admin-panel-empty">New inquiries and applications will appear here.</p>}</div>
      </article>
      <article className="admin-panel">
        <div className="admin-panel-head"><div><p className="section-kicker">Pipeline health</p><h2>Lead status</h2></div></div>
        <RankedList rows={analytics.statusBreakdown} empty="No leads yet." />
      </article>
    </section>
  </div>;
}

function AnalyticsPanel({ analytics }: { analytics: AnalyticsSummary }) {
  return <div className="admin-dashboard">
    <section className="admin-metrics analytics-metrics">
      <Metric label="Page views" value={analytics.visits30} note="Last 30 days" />
      <Metric label="Unique sessions" value={analytics.unique30} note="Anonymous session count" />
      <Metric label="7-day views" value={analytics.visits7} note="Most recent week" />
      <Metric label="Today" value={analytics.visitsToday} note="Since midnight" />
    </section>
    <section className="admin-panel admin-analytics-chart">
      <div className="admin-panel-head"><div><p className="section-kicker">30-day view</p><h2>Daily website traffic</h2></div><span>No IP addresses or personal visitor data collected</span></div>
      <DailyChart days={analytics.daily30} />
    </section>
    <section className="admin-analytics-grid">
      <article className="admin-panel"><div className="admin-panel-head"><div><p className="section-kicker">Content</p><h2>Top pages</h2></div></div><RankedList rows={analytics.topPages} empty="No page views yet." /></article>
      <article className="admin-panel"><div className="admin-panel-head"><div><p className="section-kicker">Acquisition</p><h2>Referrers</h2></div></div><RankedList rows={analytics.referrers} empty="No external referrers yet." /></article>
      <article className="admin-panel"><div className="admin-panel-head"><div><p className="section-kicker">Audience</p><h2>Devices</h2></div></div><RankedList rows={analytics.devices} empty="No device data yet." /></article>
      <article className="admin-panel"><div className="admin-panel-head"><div><p className="section-kicker">Campaigns</p><h2>UTM sources</h2></div></div><RankedList rows={analytics.sources} empty="No campaign traffic yet." /></article>
    </section>
  </div>;
}

function Metric({ label, value, note }: { label: string; value: string | number; note: string }) {
  return <article><span>{label}</span><strong>{value}</strong><small>{note}</small></article>;
}

function DailyChart({ days }: { days: { label: string; value: number }[] }) {
  const peak = Math.max(1, ...days.map((day) => day.value));
  return <div className="admin-daily-chart" aria-label="Daily website visits">{days.map((day) => <div key={day.label} title={`${day.label}: ${day.value} visits`}><span style={{ height: `${Math.max(day.value ? 8 : 2, (day.value / peak) * 100)}%` }} /><b>{day.value}</b><small>{day.label}</small></div>)}</div>;
}

function RankedList({ rows, empty }: { rows: { label: string; value: number }[]; empty: string }) {
  const peak = Math.max(1, ...rows.map((row) => row.value));
  return <div className="admin-ranked-list">{rows.length ? rows.map((row, index) => <div key={row.label}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{row.label}</strong><i style={{ width: `${(row.value / peak) * 100}%` }} /></div><b>{row.value}</b></div>) : <p className="admin-panel-empty">{empty}</p>}</div>;
}

function buildAnalytics(visits: WebsiteVisit[], inquiries: Inquiry[], applications: Application[]) {
  const now = Date.now();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const within = (date: string, days: number) => Date.parse(date) >= now - days * 86400000;
  const visits30Rows = visits.filter((visit) => within(visit.visited_at, 30));
  const count = (values: (string | null)[], fallback: string) => Array.from(values.reduce((map, value) => map.set(value || fallback, (map.get(value || fallback) || 0) + 1), new Map<string, number>())).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
  const dailySeries = (days: number) => Array.from({ length: days }, (_, index) => {
    const day = new Date(now - (days - index - 1) * 86400000); day.setHours(0, 0, 0, 0);
    const next = day.getTime() + 86400000;
    return { label: day.toLocaleDateString("en-KE", { day: "2-digit", month: "short" }), value: visits.filter((visit) => { const time = Date.parse(visit.visited_at); return time >= day.getTime() && time < next; }).length };
  });
  const allLeads = [...inquiries, ...applications];
  const statusBreakdown = statuses.map((status) => ({ label: status[0].toUpperCase() + status.slice(1), value: allLeads.filter((lead) => lead.status === status).length })).filter((row) => row.value);
  const unique30 = new Set(visits30Rows.map((visit) => visit.session_id)).size;
  const inquiries30 = inquiries.filter((inquiry) => within(inquiry.created_at, 30)).length;
  return {
    visitsToday: visits.filter((visit) => Date.parse(visit.visited_at) >= today.getTime()).length,
    visits7: visits.filter((visit) => within(visit.visited_at, 7)).length,
    visits30: visits30Rows.length,
    unique30,
    conversionRate: unique30 ? ((inquiries30 / unique30) * 100).toFixed(1) : "0.0",
    newLeads: inquiries.filter((inquiry) => inquiry.status === "new").length,
    activeApplications: applications.filter((application) => !["closed"].includes(application.status)).length,
    daily: dailySeries(14), daily30: dailySeries(30),
    topPages: count(visits30Rows.map((visit) => visit.path), "Unknown").slice(0, 10),
    referrers: count(visits30Rows.map((visit) => visit.referrer_domain), "Direct").slice(0, 10),
    devices: count(visits30Rows.map((visit) => visit.device_type), "Unknown"),
    sources: count(visits30Rows.filter((visit) => visit.utm_source).map((visit) => visit.utm_source), "Direct").slice(0, 10),
    statusBreakdown,
  };
}

function csvCell(value: string) { return `"${value.replaceAll('"', '""')}"`; }

function RecordDetail({ item, kind, onUpdate }: { item: RecordItem; kind: "inquiries" | "applications"; onUpdate: (item: RecordItem, patch: { status?: string; admin_notes?: string | null }) => Promise<void> }) {
  const [notes, setNotes] = useState(item.admin_notes ?? "");
  return <>
    <div className="record-detail-head"><div><span className={`status-pill status-${item.status}`}>{item.status}</span><h2>{item.name}</h2><a href={`mailto:${item.email}`}>{item.email}</a>{item.phone && <a href={`tel:${item.phone}`}>{item.phone}</a>}</div><time>{new Date(item.created_at).toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" })}</time></div>
    <label className="record-status">Status<select value={item.status} onChange={(e) => void onUpdate(item, { status: e.target.value })}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
    {kind === "inquiries" && "project_type" in item ? <div className="record-facts"><Fact label="Project" value={item.project_type} /><Fact label="Company" value={item.company ?? "—"} /><Fact label="Budget" value={item.budget} /><Fact label="Timeline" value={item.timeline} /><div className="record-long"><span>Project details</span><p>{item.message}</p></div></div> : "role" in item && <div className="record-facts"><Fact label="Area" value={item.role} /><Fact label="Experience" value={item.years_experience} /><Fact label="Location" value={item.location ?? "—"} /><div className="record-links">{item.linkedin_url && <a href={item.linkedin_url} target="_blank">LinkedIn ↗</a>}{item.github_url && <a href={item.github_url} target="_blank">GitHub ↗</a>}{item.portfolio_url && <a href={item.portfolio_url} target="_blank">Portfolio ↗</a>}{item.resume_url && <a href={item.resume_url} target="_blank">Résumé ↗</a>}</div><div className="record-long"><span>Application note</span><p>{item.cover_note}</p></div></div>}
    <label className="admin-notes">Private notes<textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} placeholder="Add follow-up notes visible only to administrators." /></label>
    <button className="save-notes" onClick={() => void onUpdate(item, { admin_notes: notes || null })}>Save notes</button>
  </>;
}

function Fact({ label, value }: { label: string; value: string }) { return <div><span>{label}</span><strong>{value}</strong></div>; }
