"use client";

import { useEffect, useState, type FormEvent } from "react";
import { BrandMark } from "../../components/BrandMark";
import { PortalHeader } from "../../components/PortalHeader";
import { getSupabaseBrowserClient } from "../../../lib/supabase";

type RecoveryState = "loading" | "ready" | "invalid" | "setup" | "success";

export default function ResetPasswordPage() {
  const supabase = getSupabaseBrowserClient();
  const [state, setState] = useState<RecoveryState>(supabase ? "loading" : "setup");
  const [errorMessage, setErrorMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    async function confirmRecoverySession() {
      const { data, error } = await supabase.auth.getClaims();
      const email = String(data?.claims?.email ?? "").toLowerCase();
      if (!error && email === "hello@wyksoftsinc.com") {
        setState("ready");
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        setState("invalid");
      }
    }

    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        window.setTimeout(() => void confirmRecoverySession(), 0);
      }
    });

    void confirmRecoverySession();
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  async function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || state !== "ready") return;

    const values = new FormData(event.currentTarget);
    const password = String(values.get("password") ?? "");
    const confirmation = String(values.get("confirmation") ?? "");

    if (password.length < 12) {
      setErrorMessage("Use at least 12 characters for your new password.");
      return;
    }
    if (password !== confirmation) {
      setErrorMessage("The two passwords do not match.");
      return;
    }

    setSaving(true);
    setErrorMessage("");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setSaving(false);
      setErrorMessage("This recovery link is invalid or has expired. Request a new one from the admin login page.");
      return;
    }

    await supabase.auth.signOut();
    setState("success");
    setSaving(false);
  }

  return (
    <main className="portal-page admin-page">
      <PortalHeader label="Password recovery" />
      <section className="admin-login-wrap">
        <div className="admin-login-copy">
          <p className="section-kicker">Secure account recovery</p>
          <h1>Reset your password.</h1>
          <p>The recovery link is single-use. Choose a strong password that is unique to WykSofts administration.</p>
        </div>
        <div className="admin-login-card">
          {state === "loading" && <div><BrandMark className="admin-lock" /><h2>Checking link…</h2><p>We are securely validating your recovery session.</p></div>}
          {state === "setup" && <div><BrandMark className="admin-lock" /><h2>Recovery unavailable</h2><p>The authentication connection is not configured.</p></div>}
          {state === "invalid" && <div><BrandMark className="admin-lock" /><h2>Request a reset link</h2><p>Open this page from the password-reset email. Recovery links are single-use and expire for your protection.</p><a className="portal-submit" href="/admin/">Return to admin sign in <span>↗</span></a></div>}
          {state === "success" && <div><span className="admin-success-mark">✓</span><h2>Password updated</h2><p>Your new password is ready. You can now sign in to the WykSofts dashboard.</p><a className="portal-submit" href="/admin/">Continue to sign in <span>↗</span></a></div>}
          {state === "ready" && <form onSubmit={updatePassword}><BrandMark className="admin-lock" /><h2>Choose a new password</h2><p>Use at least 12 characters and avoid reusing a password from another account.</p><label>New password<input name="password" type="password" autoComplete="new-password" minLength={12} required /></label><label>Confirm new password<input name="confirmation" type="password" autoComplete="new-password" minLength={12} required /></label>{errorMessage && <p className="portal-error" role="alert">{errorMessage}</p>}<button className="portal-submit" type="submit" disabled={saving}>{saving ? "Updating password…" : "Set new password"}<span>↗</span></button></form>}
        </div>
      </section>
    </main>
  );
}
