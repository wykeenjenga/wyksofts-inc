"use client";

import { useEffect } from "react";

/**
 * Supabase recovery links may occasionally arrive at the configured Site URL
 * instead of the password form (for example, links issued before the redirect
 * allow-list was updated). Keep the token in the URL fragment and move the
 * visitor to the dedicated recovery screen.
 */
export function RecoveryRedirect() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const params = new URLSearchParams(hash.slice(1));
    const isRecovery =
      params.get("type") === "recovery" ||
      params.has("access_token") ||
      params.has("error") ||
      params.has("error_code") ||
      params.has("error_description");
    if (!isRecovery) return;

    window.location.replace(`/admin/reset-password/${window.location.search}${hash}`);
  }, []);

  return null;
}
