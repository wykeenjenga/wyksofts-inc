import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`https://wyksofts.example${path}`, {
      headers: {
        accept: "text/html",
        host: "wyksofts.example",
        "x-forwarded-host": "wyksofts.example",
        "x-forwarded-proto": "https",
      },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the WykSofts landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /<title>WykSofts Inc\. \| Software Development &amp; Digital Solutions<\/title>/i,
  );
  assert.match(html, /WykSofts Inc\./);
  assert.match(html, /We build digital products/);
  assert.match(html, /Mobile apps/);
  assert.match(html, /Websites &amp; web apps/);
  assert.match(html, /Custom software/);
  assert.match(html, /Mirage Towers, Nairobi/);
  assert.match(html, /Mynomp/);
  assert.match(html, /City BBQ App/);
  assert.match(html, /SlimChickens App/);
  assert.match(html, /Selected clients/);
  assert.match(html, /Product website/);
  assert.match(html, /iOS &amp; iPadOS app/);
  assert.match(html, /iOS app/);
  assert.match(html, /https:\/\/www\.mynomp\.com\//);
  assert.match(html, /https:\/\/apps\.apple\.com\/us\/app\/city-barbeque\/id979145837/);
  assert.match(html, /https:\/\/apps\.apple\.com\/us\/app\/slim-chickens\/id1244055810/);
  assert.match(html, /wa\.me\/254703285070/);
  assert.match(html, /Book a discovery call/);
  assert.match(html, /Mirage\+Towers\+Nairobi/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /ProfessionalService/);
  assert.match(html, /All rights reserved/);
  assert.match(html, /mailto:hello@wyksoftsinc\.com/);
  assert.match(html, /tel:\+254703285070/);
  assert.match(html, /\+254 703 285 070/);
  assert.match(html, /https:\/\/wyksofts\.example\/og\.png/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("server-renders the separated professional content pages", async () => {
  const [services, clients, pricing, about, faq, policies] = await Promise.all([
    render("/services").then((response) => response.text()),
    render("/clients").then((response) => response.text()),
    render("/pricing").then((response) => response.text()),
    render("/about").then((response) => response.text()),
    render("/faq").then((response) => response.text()),
    render("/policies").then((response) => response.text()),
  ]);

  assert.match(services, /APIs &amp; integrations/);
  assert.match(services, /AI &amp; cloud/);
  assert.match(clients, /Mynomp Spark product mark/);
  assert.match(clients, /Challenge/);
  assert.match(pricing, /From \$100/);
  assert.match(pricing, /Build your quotation request/);
  assert.match(pricing, /Continue on WhatsApp/);
  assert.match(about, /Wycliff Njenga/);
  assert.match(about, /WykSofts in motion/);
  assert.match(about, /wyksofts-launch\.mp4/);
  assert.match(faq, /How much does a project cost/);
  assert.match(policies, /Terms of engagement/);
  assert.match(policies, /Confidentiality &amp; security/);
});

test("keeps the finished site free of starter-preview files", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /SiteHeader/);
  assert.match(page, /SiteFooter/);
  assert.match(layout, /generateMetadata/);
  assert.match(layout, /og\.png/);
  assert.match(packageJson, /"name": "wyksofts-landing-page"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await assert.rejects(
    access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)),
  );
});
