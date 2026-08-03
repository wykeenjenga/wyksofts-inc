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
    /href="\.\/assets\/(page-[^"]+\.js)"/i,
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
  ]);
});
