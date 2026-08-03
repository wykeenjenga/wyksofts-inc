"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
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

type RecordItem = Inquiry | Application;
const statuses = ["new", "reviewing", "contacted", "shortlisted", "closed"];

export default function AdminPage() {
  const supabase = getSupabaseBrowserClient();
  const [authState, setAuthState] = useState<"loading" | "signed-out" | "admin" | "denied" | "setup">(supabase ? "loading" : "setup");
  const [tab, setTab] = useState<"inquiries" | "applications">("inquiries");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (!supabase) return;
    void checkAccess();
    const { data } = supabase.auth.onAuthStateChange(() => void checkAccess());
    return () => data.subscription.unsubscribe();
  }, [supabase]);

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
    const [inquiryResult, applicationResult] = await Promise.all([
      supabase.from("wyksofts_inquiries").select("*").order("created_at", { ascending: false }),
      supabase.from("wyksofts_job_applications").select("*").order("created_at", { ascending: false }),
    ]);
    if (!inquiryResult.error) setInquiries(inquiryResult.data as Inquiry[]);
    if (!applicationResult.error) setApplications(applicationResult.data as Application[]);
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

  async function updateRecord(item: RecordItem, patch: { status?: string; admin_notes?: string | null }) {
    if (!supabase) return;
    const table = tab === "inquiries" ? "wyksofts_inquiries" : "wyksofts_job_applications";
    const { error } = await supabase.from(table).update({ ...patch, updated_at: new Date().toISOString() }).eq("id", item.id);
    if (!error) await loadRecords();
  }

  const records = tab === "inquiries" ? inquiries : applications;
  const visibleRecords = useMemo(() => records.filter((record) => {
    const haystack = `${record.name} ${record.email} ${"company" in record ? record.company ?? "" : record.role}`.toLowerCase();
    return (filter === "all" || record.status === filter) && haystack.includes(search.toLowerCase());
  }), [records, filter, search]);
  const selected = records.find((record) => record.id === selectedId) ?? visibleRecords[0] ?? null;

  if (authState !== "admin") {
    return (
      <main className="portal-page admin-page">
        <PortalHeader label="Admin" />
        <section className="admin-login-wrap">
          <div className="admin-login-copy"><p className="section-kicker">Private workspace</p><h1>WykSofts Admin</h1><p>Review project inquiries and career applications from one focused workspace.</p></div>
          <div className="admin-login-card">
            {authState === "setup" ? <><h2>Connect Supabase</h2><p>Add the project URL and publishable key to enable secure admin access.</p></> : authState === "denied" ? <><h2>Access restricted</h2><p>This account is signed in but does not have WykSofts administrator access.</p><button className="portal-submit" onClick={() => supabase?.auth.signOut()}>Sign out</button></> : <form onSubmit={login}><span className="admin-lock">W</span><h2>Secure sign in</h2><p>Authorized WykSofts administrators only.</p><label>Email<input name="email" type="email" autoComplete="email" defaultValue="hello@wyksoftsinc.com" required /></label><label>Password<input name="password" type="password" autoComplete="current-password" required /></label>{authError && <p className="portal-error">{authError}</p>}<button className="portal-submit" type="submit">Enter dashboard <span>↗</span></button></form>}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a className="brand admin-brand" href="/"><span className="brand-mark">W</span><span>WykSofts</span></a>
        <nav aria-label="Admin navigation">
          <button className={tab === "inquiries" ? "active" : ""} onClick={() => { setTab("inquiries"); setSelectedId(null); }}><span>01</span>Inquiries <b>{inquiries.length}</b></button>
          <button className={tab === "applications" ? "active" : ""} onClick={() => { setTab("applications"); setSelectedId(null); }}><span>02</span>Applications <b>{applications.length}</b></button>
        </nav>
        <div className="admin-sidebar-bottom"><a href="/" target="_blank">View website ↗</a><button onClick={() => supabase?.auth.signOut()}>Sign out</button></div>
      </aside>
      <section className="admin-main">
        <header className="admin-topbar"><div><p className="section-kicker">Lead workspace</p><h1>{tab === "inquiries" ? "Project inquiries" : "Career applications"}</h1></div><button onClick={loadRecords} disabled={loading}>{loading ? "Refreshing…" : "Refresh ↻"}</button></header>
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
      </section>
    </main>
  );
}

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
