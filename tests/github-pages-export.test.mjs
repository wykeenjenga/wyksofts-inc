import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("GitHub Pages export keeps the client-side hero interactive", async () => {
  const html = await readFile(
    new URL("../docs/index.html", import.meta.url),
    "utf8",
  );

  assert.match(html, /<script\b/i);
  assert.match(html, /import\("\.\/assets\/index-[^\"]+\.js"\)/i);
  assert.match(html, /Click the orange words/);
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
});
