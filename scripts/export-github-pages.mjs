import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";

const docsRoot = new URL("../docs/", import.meta.url);
const workerUrl = new URL("../dist/server/index.js", import.meta.url);
const { default: worker } = await import(
  `${workerUrl.href}?export=${Date.now()}`
);

const response = await worker.fetch(
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

if (!response.ok) {
  throw new Error(`Static export failed with status ${response.status}`);
}

let html = await response.text();
html = html
  .replaceAll("/assets/", "./assets/")
  .replaceAll('href="/favicon.svg"', 'href="./favicon.svg"')
  .replaceAll("<!-- -->", "");

const pagesOrigin = process.env.PAGES_ORIGIN?.replace(/\/$/, "");
if (pagesOrigin) {
  html = html.replaceAll(
    "https://wyksofts.example/og.png",
    `${pagesOrigin}/og.png`,
  );
} else {
  html = html
    .replace(/<meta property="og:image"[^>]*\/>/gi, "")
    .replace(/<meta property="og:image:(?:width|height|alt)"[^>]*\/>/gi, "")
    .replace(/<meta name="twitter:image"[^>]*\/>/gi, "");
}

await rm(docsRoot, { recursive: true, force: true });
await mkdir(docsRoot, { recursive: true });
await cp(new URL("../dist/client/assets/", import.meta.url), new URL("assets/", docsRoot), {
  recursive: true,
});
await cp(new URL("../public/og.png", import.meta.url), new URL("og.png", docsRoot));
await cp(
  new URL("../public/projects/", import.meta.url),
  new URL("projects/", docsRoot),
  { recursive: true },
);
await cp(
  new URL("../public/favicon.svg", import.meta.url),
  new URL("favicon.svg", docsRoot),
);

const assetFiles = await readdir(new URL("assets/", docsRoot));
for (const assetFile of assetFiles) {
  if (!assetFile.endsWith(".css")) continue;
  const cssUrl = new URL(`assets/${assetFile}`, docsRoot);
  const css = await readFile(cssUrl, "utf8");
  await writeFile(cssUrl, css.replaceAll("url(/assets/", "url(./"), "utf8");
}

await writeFile(new URL("index.html", docsRoot), html, "utf8");
await writeFile(new URL(".nojekyll", docsRoot), "", "utf8");

console.log(`GitHub Pages bundle exported to ${docsRoot.pathname}`);
