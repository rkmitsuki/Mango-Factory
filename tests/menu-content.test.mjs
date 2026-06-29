import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import Module from "node:module";
import path from "node:path";
import ts from "typescript";

async function loadMenuContentModule() {
  const modulePath = new URL("../lib/menu-content.ts", import.meta.url);
  const source = await readFile(modulePath, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2019,
      esModuleInterop: true,
    },
    fileName: modulePath.pathname,
  });

  const runtimeModule = new Module.Module(modulePath.pathname);
  runtimeModule.filename = modulePath.pathname;
  runtimeModule.paths = Module._nodeModulePaths(path.dirname(modulePath.pathname));
  runtimeModule._compile(compiled.outputText, modulePath.pathname);
  return runtimeModule.exports;
}

async function loadSiteModule() {
  const modulePath = new URL("../lib/site.ts", import.meta.url);
  const source = await readFile(modulePath, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2019,
      esModuleInterop: true,
    },
    fileName: modulePath.pathname,
  });

  const runtimeModule = new Module.Module(modulePath.pathname);
  runtimeModule.filename = modulePath.pathname;
  runtimeModule.paths = Module._nodeModulePaths(path.dirname(modulePath.pathname));
  runtimeModule.require = (request) => {
    if (request === "@/lib/menu-content") {
      return Module.createRequire(import.meta.url)("../lib/menu-content.ts");
    }

    return Module.createRequire(modulePath)(request);
  };
  runtimeModule._compile(compiled.outputText, modulePath.pathname);
  return runtimeModule.exports;
}

test("parseMenuContentDocument accepts valid firestore menu content", async () => {
  const { parseMenuContentDocument } = await loadMenuContentModule();

  const parsed = parseMenuContentDocument({
    sections: [
      {
        name: "Burgers",
        note: "Top sellers",
        items: [
          {
            name: "Paneer Burger",
            description: "Savory",
            price: "$16.99",
            tags: ["Top Picks", "Popular"],
            image: "https://example.com/paneer.jpg",
          },
        ],
      },
    ],
    updatedAt: 1,
  });

  assert.equal(parsed.sections[0].name, "Burgers");
  assert.equal(parsed.sections[0].items[0].image, "https://example.com/paneer.jpg");
  assert.equal(parsed.updatedAt, 1);
});

test("parseMenuContentDocument rejects invalid section arrays", async () => {
  const { parseMenuContentDocument } = await loadMenuContentModule();

  assert.equal(parseMenuContentDocument({ sections: null }), null);
  assert.equal(parseMenuContentDocument({}), null);
  assert.equal(
    parseMenuContentDocument({
      sections: [{ name: "Broken", note: "No items", items: "bad" }],
    }),
    null,
  );
});

test("parseMenuContentDocument rejects wrong updatedAt types when present", async () => {
  const { parseMenuContentDocument } = await loadMenuContentModule();

  assert.equal(
    parseMenuContentDocument({
      sections: [],
      updatedAt: "1",
    }),
    null,
  );
  assert.equal(
    parseMenuContentDocument({
      sections: [],
      updatedAt: null,
    }),
    null,
  );
  assert.equal(
    parseMenuContentDocument({
      sections: [],
      updatedAt: {},
    }),
    null,
  );
});

test("getSignatureItems returns top picks first, then fills from remaining items up to four", async () => {
  const { fallbackMenuSections, getSignatureItems } = await loadMenuContentModule();

  const items = getSignatureItems(fallbackMenuSections);
  const allItems = fallbackMenuSections.flatMap((section) => section.items);
  const topPicks = allItems.filter((item) => item.tags.includes("Top Picks"));
  const remainingItems = allItems.filter((item) => !item.tags.includes("Top Picks"));
  const expectedItems = [...topPicks, ...remainingItems].slice(0, 4);

  assert.equal(items.length, Math.min(allItems.length, 4));
  assert.deepEqual(items, expectedItems);
});

test("site signatures stay aligned with shared menu content", async () => {
  const { fallbackMenuSections } = await loadMenuContentModule();
  const { menuSections, signatures } = await loadSiteModule();
  const menuItemsByName = new Map(
    fallbackMenuSections.flatMap((section) => section.items).map((item) => [item.name, item]),
  );

  assert.deepEqual(menuSections, fallbackMenuSections);
  assert.equal(signatures.length, 4);

  for (const signature of signatures) {
    const menuItem = menuItemsByName.get(signature.name);

    assert.ok(menuItem, `missing menu item for signature ${signature.name}`);
    assert.equal(signature.price, menuItem.price);
    assert.match(signature.image, /^https:\/\/images\.unsplash\.com\//);
  }
});
