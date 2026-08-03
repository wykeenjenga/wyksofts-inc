import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";

const docsRoot = new URL("../docs/", import.meta.url);
const workerUrl = new URL("../dist/server/index.js", import.meta.url);
const { default: worker } = await import(
  `${workerUrl.href}?export=${Date.now()}`
);

const routes = [
  { path: "/", output: "index.html", prefix: "./" },
  { path: "/inquiry", output: "inquiry/index.html", prefix: "../" },
  { path: "/careers", output: "careers/index.html", prefix: "../" },
  { path: "/admin", output: "admin/index.html", prefix: "../" },
];

async function renderRoute(path) {
  const response = await worker.fetch(
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

  if (!response.ok) {
    throw new Error(`Static export failed for ${path} with status ${response.status}`);
  }

  return response.text();
}

const pagesOrigin = process.env.PAGES_ORIGIN?.replace(/\/$/, "");
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
  new URL("../public/media/", import.meta.url),
  new URL("media/", docsRoot),
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

for (const route of routes) {
  let html = await renderRoute(route.path);
  html = html
    .replaceAll("/assets/", `${route.prefix}assets/`)
    .replaceAll('href="/favicon.svg"', `href="${route.prefix}favicon.svg"`)
    .replaceAll("<!-- -->", "");

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

  const outputUrl = new URL(route.output, docsRoot);
  await mkdir(new URL("./", outputUrl), { recursive: true });
  await writeFile(outputUrl, html, "utf8");
}
await writeFile(new URL(".nojekyll", docsRoot), "", "utf8");

console.log(`GitHub Pages bundle exported to ${docsRoot.pathname}`);
