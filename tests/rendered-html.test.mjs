import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("https://wyksofts.example/", {
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
  assert.match(html, /APIs &amp; integrations/);
  assert.match(html, /AI &amp; cloud/);
  assert.match(html, /Nairobi, Kenya/);
  assert.match(html, /href="#contact"/);
  assert.match(html, /mailto:support@mynomp\.com/);
  assert.match(html, /tel:\+254703285070/);
  assert.match(html, /\+254 703 285 070/);
  assert.match(html, /https:\/\/wyksofts\.example\/og\.png/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("keeps the finished site free of starter-preview files", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /WykSofts Inc\./);
  assert.match(layout, /generateMetadata/);
  assert.match(layout, /og\.png/);
  assert.match(packageJson, /"name": "wyksofts-landing-page"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await assert.rejects(
    access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)),
  );
});
