import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("GitHub Pages export keeps the client-side hero interactive", async () => {
  const html = await readFile(
    new URL("../docs/index.html", import.meta.url),
    "utf8",
  );

  assert.match(html, /<script\b/i);
  assert.match(html, /import\("\.\/assets\/index-[^\"]+\.js"\)/i);
  assert.match(html, /Choose an outcome/);
  assert.match(html, /Grow/);
  assert.match(html, /Delight/);
  assert.match(html, /Simplify/);
  assert.doesNotMatch(html, /["']\/assets\//);

  const pageAsset = html.match(
    /href="\.\/assets\/(HomeHero-[^"]+\.js)"/i,
  )?.[1];
  assert.ok(pageAsset, "expected the interactive page bundle to be linked");

  const pageJavaScript = await readFile(
    new URL(`../docs/assets/${pageAsset}`, import.meta.url),
    "utf8",
  );
  assert.match(pageJavaScript, /delight customers/);
  assert.match(pageJavaScript, /simplify work/);
  assert.match(pageJavaScript, /onClick/);

  await Promise.all([
    access(new URL("../docs/projects/mynomp-mark.svg", import.meta.url)),
    access(new URL("../docs/projects/city-barbeque.jpg", import.meta.url)),
    access(new URL("../docs/projects/slim-chickens.jpg", import.meta.url)),
    access(new URL("../docs/media/wyksofts-launch.mp4", import.meta.url)),
    access(new URL("../docs/media/wyksofts-launch-poster.jpg", import.meta.url)),
  ]);
});

test("exports the marketing site, inquiry flows, careers, and protected admin pages", async () => {
  const [home, services, clients, pricing, about, faq, policies, inquiry, booking, careers, careerSource, admin, resetPassword] = await Promise.all([
    readFile(new URL("../docs/index.html", import.meta.url), "utf8"),
    readFile(new URL("../docs/services/index.html", import.meta.url), "utf8"),
    readFile(new URL("../docs/clients/index.html", import.meta.url), "utf8"),
    readFile(new URL("../docs/pricing/index.html", import.meta.url), "utf8"),
    readFile(new URL("../docs/about/index.html", import.meta.url), "utf8"),
    readFile(new URL("../docs/faq/index.html", import.meta.url), "utf8"),
    readFile(new URL("../docs/policies/index.html", import.meta.url), "utf8"),
    readFile(new URL("../docs/inquiry/index.html", import.meta.url), "utf8"),
    readFile(new URL("../docs/book/index.html", import.meta.url), "utf8"),
    readFile(new URL("../docs/careers/index.html", import.meta.url), "utf8"),
    readFile(new URL("../app/careers/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../docs/admin/index.html", import.meta.url), "utf8"),
    readFile(new URL("../docs/admin/reset-password/index.html", import.meta.url), "utf8"),
  ]);

  assert.match(home, /Product thinking from idea to launch/);
  assert.match(home, /href="\.\/services\//);
  assert.doesNotMatch(home, /Frequently asked questions/);
  assert.match(services, /Digital products, designed and engineered as one/);
  assert.match(services, /Clear thinking\. Close collaboration/);
  assert.match(clients, /Products made for people to use/);
  assert.match(clients, /SlimChickens App/);
  assert.match(pricing, /Build your quotation request/);
  assert.match(pricing, /Request quotation/);
  assert.match(about, /Wycliff Njenga/);
  assert.match(about, /Download launch film/);
  assert.match(faq, /Good questions deserve clear answers/);
  assert.match(policies, /Project cancellation/);
  assert.match(inquiry, /Tell us what you want to build/);
  assert.match(inquiry, /Send project inquiry/);
  assert.match(inquiry, /\.\.\/assets\/index-/);
  assert.match(home, /href="\.\/book\/"/);
  assert.match(booking, /clearest next move/);
  assert.match(booking, /Request discovery call/);
  assert.match(booking, /\.\.\/assets\/index-/);
  assert.match(careers, /Do work that moves people forward/);
  assert.match(careers, /Submit application/);
  assert.match(careers, /Software Engineer/);
  assert.match(careers, /Tell us about another discipline/);
  assert.match(careerSource, /Your area of expertise/);
  assert.match(careerSource, /selectedRole === "Other"/);
  assert.match(admin, /WykSofts Admin/);
  assert.match(admin, /Secure sign in/);
  assert.match(admin, /hello@wyksoftsinc\.com/);
  assert.match(admin, /Forgot password/);
  assert.match(admin, /\.\.\/brand\/wyksofts-mark\.png/);
  assert.match(admin, /\.\.\/favicon\.png/);
  assert.match(admin, /\.\.\/assets\/index-/);
  assert.match(resetPassword, /Reset your password/);
  assert.match(resetPassword, /Checking link/);
  assert.match(resetPassword, /\.\.\/\.\.\/assets\/index-/);
  assert.match(resetPassword, /\.\.\/\.\.\/brand\/wyksofts-mark\.png/);
});

test("covers recovery failures and ships WykSofts email templates", async () => {
  const [resetSource, recoveryEmail, confirmationEmail] = await Promise.all([
    readFile(new URL("../app/admin/reset-password/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../supabase/email-templates/recovery.html", import.meta.url), "utf8"),
    readFile(new URL("../supabase/email-templates/confirmation.html", import.meta.url), "utf8"),
  ]);

  assert.match(resetSource, /otp_expired/);
  assert.match(resetSource, /already been used/);
  assert.match(resetSource, /This recovery link has expired/);
  assert.match(resetSource, /This recovery link cannot be used/);
  assert.match(resetSource, /Password updated/);
  assert.match(recoveryEmail, /Reset your WykSofts password/);
  assert.match(recoveryEmail, /\{\{ \.ConfirmationURL \}\}/);
  assert.match(recoveryEmail, /hello@wyksoftsinc\.com/);
  assert.match(confirmationEmail, /Confirm your administrator account/);
  assert.doesNotMatch(`${recoveryEmail}${confirmationEmail}`, /nomp|support@mynomp/i);
});

test("ships privacy-conscious website analytics and the admin reporting workspace", async () => {
  const [analyticsSource, adminSource, migration] = await Promise.all([
    readFile(new URL("../app/components/SiteAnalytics.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/admin/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../supabase/migrations/20260812131642_add_website_analytics.sql", import.meta.url), "utf8"),
  ]);

  assert.match(analyticsSource, /navigator\.doNotTrack/);
  assert.match(analyticsSource, /pathname\.startsWith\("\/admin"\)/);
  assert.match(analyticsSource, /referrer_domain/);
  assert.doesNotMatch(analyticsSource, /ip_address|document\.referrer[^)]*insert/);
  assert.match(adminSource, /Website analytics/);
  assert.match(adminSource, /Lead conversion/);
  assert.match(adminSource, /Export CSV/);
  assert.match(adminSource, /No IP addresses or personal visitor data collected/);
  assert.match(migration, /enable row level security/);
  assert.match(migration, /WykSofts admin can read website analytics/);
  assert.match(migration, /hello@wyksoftsinc\.com/);
});
