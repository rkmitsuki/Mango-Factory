import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const css = fs.readFileSync(path.join(__dirname, "..", "app", "globals.css"), "utf8");
const showcase = fs.readFileSync(path.join(__dirname, "..", "components", "home-showcase.tsx"), "utf8");

test("order pairing cards use the sans stack instead of the display face", () => {
  const rule = css.match(/\.carousel-card strong\s*\{[^}]*font-family:\s*([^;]+);/);

  assert.ok(rule, "expected a .carousel-card strong font-family rule");
  assert.match(rule[1], /var\(--font-sans\)/);
  assert.doesNotMatch(rule[1], /var\(--font-display\)/);
});

test("order pairing carousel reserves a fixed stage height for animation", () => {
  const stageRule = css.match(/\.carousel-stage\s*\{[^}]*height:\s*360px;/);
  const cardRule = css.match(/\.carousel-card\s*\{[^}]*height:\s*100%;/);

  assert.ok(stageRule, "expected .carousel-stage to reserve a fixed height");
  assert.ok(cardRule, "expected .carousel-card to fill the reserved stage height");
});

test("fading carousels use on-card arrow navigation instead of text prev next controls", () => {
  assert.doesNotMatch(showcase, />\s*Prev\s*</);
  assert.doesNotMatch(showcase, />\s*Next\s*</);
  assert.match(showcase, /aria-label="Show previous pairing"/);
  assert.match(showcase, /aria-label="Show next pairing"/);
  assert.match(showcase, /aria-label="Show previous review"/);
  assert.match(showcase, /aria-label="Show next review"/);
});
