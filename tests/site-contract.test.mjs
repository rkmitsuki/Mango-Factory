import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

test("homepage is branded for Mango Factory with ordering and directions", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  assert.match(page, /Mango Factory/);
  assert.match(page, /Order online/);
  assert.match(page, /Get directions/);
  assert.match(page, /326 Commercial St/);
  assert.match(page, /Desi burgers meet Alphonso mango/);
  assert.match(page, /paneer\s+burgers/i);
  assert.match(page, /momo noodle soup/i);
});

test("content model includes actual DoorDash burger and savory favorites", async () => {
  const content = await readFile(new URL("../lib/site.ts", import.meta.url), "utf8");

  assert.match(content, /Desi Veg Paneer Burger/);
  assert.match(content, /Desi Veg Cheese Burger/);
  assert.match(content, /Fresh Alphonso mango juice/);
  assert.match(content, /Veg fried rice/);
  assert.match(content, /Veg spring rolls/);
});

test("growth dashboard route exists and exposes client-safe business metrics", async () => {
  const routePath = new URL("../app/marketing/page.tsx", import.meta.url);
  assert.equal(existsSync(routePath), true);

  const page = await readFile(routePath, "utf8");
  assert.match(page, /Growth dashboard/);
  assert.match(page, /Offers/);
  assert.match(page, /ordering signals/);
  assert.doesNotMatch(page, /Firebase/);
  assert.doesNotMatch(page, /marketing push/i);
});

test("homepage avoids internal sales-process copy", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  assert.doesNotMatch(page, /sell the next visit/i);
  assert.doesNotMatch(page, /site now sells/i);
  assert.doesNotMatch(page, /marketing push/i);
});
