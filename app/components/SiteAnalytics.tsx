"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getSupabaseBrowserClient } from "../../lib/supabase";

const SESSION_KEY = "wyksofts_analytics_session";

function sessionId() {
  const existing = window.sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const id = window.crypto.randomUUID();
  window.sessionStorage.setItem(SESSION_KEY, id);
  return id;
}

function deviceType() {
  const ua = navigator.userAgent;
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) return "tablet";
  if (/Mobi|Android|iPhone|iPod/i.test(ua)) return "mobile";
  return "desktop";
}

function referrerDomain() {
  if (!document.referrer) return null;
  try {
    const host = new URL(document.referrer).hostname.toLowerCase();
    return host === window.location.hostname.toLowerCase() ? null : host;
  } catch {
    return null;
  }
}

export function SiteAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (navigator.doNotTrack === "1") return;

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const query = new URLSearchParams(window.location.search);
    void supabase.from("wyksofts_website_visits").insert({
      session_id: sessionId(),
      path: pathname.slice(0, 300),
      referrer_domain: referrerDomain(),
      device_type: deviceType(),
      utm_source: query.get("utm_source")?.slice(0, 120) || null,
      utm_campaign: query.get("utm_campaign")?.slice(0, 160) || null,
    });
  }, [pathname]);

  return null;
}
