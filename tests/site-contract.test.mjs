import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import test from "node:test";
import assert from "node:assert/strict";

test("homepage is branded for Mango Factory with ordering and directions", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const liveHomePage = await readFile(new URL("../components/live-home-page.tsx", import.meta.url), "utf8");
  const showcase = await readFile(new URL("../components/home-showcase.tsx", import.meta.url), "utf8");

  assert.match(page, /LiveHomePage/);
  assert.match(liveHomePage, /Mango Factory/);
  assert.match(liveHomePage, /Order online/);
  assert.match(liveHomePage, /Get directions/);
  assert.match(liveHomePage, /326 Commercial St/);
  assert.match(liveHomePage, /Burgers, mango drinks, momos/);
  assert.match(liveHomePage, /paneer\s+burgers/i);
  assert.match(liveHomePage, /momo noodle soup/i);
  assert.match(showcase, /Order pairings/);
  assert.match(showcase, /Most popular combinations/);
  assert.match(showcase, /Open in Maps/);
  assert.match(showcase, /Order online/);
});

test("content model includes actual DoorDash burger and savory favorites", async () => {
  const content = await readFile(new URL("../lib/menu-content.ts", import.meta.url), "utf8");

  assert.match(content, /Desi Veg Paneer Burger/);
  assert.match(content, /Desi Veg Cheese Burger/);
  assert.match(content, /Fresh Alphonso Mango Juice/);
  assert.match(content, /Veg Fried Rice/);
  assert.match(content, /Veg Spring Rolls/);
});

test("growth dashboard route exists and exposes client-safe business metrics", async () => {
  const routePath = new URL("../app/marketing/page.tsx", import.meta.url);
  assert.equal(existsSync(routePath), true);

  const route = await readFile(routePath, "utf8");
  const page = await readFile(new URL("../app/marketing/dashboard-client.tsx", import.meta.url), "utf8");
  assert.match(route, /Owner Dashboard/);
  assert.match(page, /Owner dashboard/);
  assert.match(page, /Comment tracking/);
  assert.match(page, /Offer planner/);
  assert.match(page, /ordering/);
  assert.doesNotMatch(page, /Firebase/);
  assert.doesNotMatch(page, /marketing push/i);
});

test("homepage avoids internal sales-process copy", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const liveHomePage = await readFile(new URL("../components/live-home-page.tsx", import.meta.url), "utf8");
  const chrome = await readFile(new URL("../components/site-chrome.tsx", import.meta.url), "utf8");

  assert.doesNotMatch(page, /sell the next visit/i);
  assert.doesNotMatch(page, /site now sells/i);
  assert.doesNotMatch(page, /marketing push/i);
  assert.doesNotMatch(page, /Open dashboard/i);
  assert.doesNotMatch(liveHomePage, /sell the next visit/i);
  assert.doesNotMatch(liveHomePage, /site now sells/i);
  assert.doesNotMatch(liveHomePage, /marketing push/i);
  assert.doesNotMatch(liveHomePage, /Open dashboard/i);
  assert.doesNotMatch(chrome, /Dashboard/i);
});

test("public pages use live menu loaders with fallback content", async () => {
  const home = await readFile(new URL("../components/live-home-page.tsx", import.meta.url), "utf8");
  const menu = await readFile(new URL("../components/mango-menu-page.tsx", import.meta.url), "utf8");
  const loader = await readFile(new URL("../lib/use-live-menu-sections.ts", import.meta.url), "utf8");

  assert.match(home, /getSignatureItems/);
  assert.match(home, /useLiveMenuSections/);
  assert.match(menu, /useLiveMenuSections/);
  assert.match(menu, /const menuSections = useLiveMenuSections\(\)/);
  assert.match(loader, /^"use client";/);
  assert.match(loader, /useState<MenuSection\[]>\(fallbackMenuSections\)/);
});

test("about page exists with mango journey story and action links", async () => {
  const routePath = new URL("../app/about/page.tsx", import.meta.url);
  const route = await readFile(routePath, "utf8");
  const chrome = await readFile(new URL("../components/site-chrome.tsx", import.meta.url), "utf8");

  assert.equal(existsSync(routePath), true);
  assert.match(route, /From mango farm to plate/i);
  assert.match(route, /small-batch/i);
  assert.match(route, /ripe fruit/i);
  assert.match(route, /View menu/);
  assert.match(chrome, /About/);
});

test("hidden admin route exists with email password auth and no register flow", async () => {
  const route = await readFile(new URL("../app/mh-admin/page.tsx", import.meta.url), "utf8");
  const authForm = await readFile(new URL("../components/admin/auth-form.tsx", import.meta.url), "utf8");

  assert.match(route, /HiddenAdminPage/);
  assert.match(route, /AdminAuthForm/);
  assert.match(route, /AdminMenuEditor/);
  assert.match(authForm, /signInWithEmailAndPassword/);
  assert.match(authForm, /type="email"/);
  assert.match(authForm, /type="password"/);
  assert.doesNotMatch(authForm, /register/i);
});

test("admin editor saves full menu documents to firestore and signs out", async () => {
  const editor = await readFile(new URL("../components/admin/menu-editor.tsx", import.meta.url), "utf8");

  assert.match(editor, /setDoc/);
  assert.match(editor, /site-content/);
  assert.match(editor, /menu/);
  assert.match(editor, /updatedAt/);
  assert.match(editor, /signOut/);
  assert.match(editor, /validateSections/);
});

test("admin editor uploads item photos to firebase storage", async () => {
  const editor = await readFile(new URL("../components/admin/menu-editor.tsx", import.meta.url), "utf8");

  assert.match(editor, /uploadBytes/);
  assert.match(editor, /getDownloadURL/);
  assert.match(editor, /firebaseStorage/);
  assert.match(editor, /type="file"/);
});

test("readme documents firebase env vars and hidden admin route", async () => {
  const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");

  assert.match(readme, /NEXT_PUBLIC_FIREBASE_API_KEY/);
  assert.match(readme, /NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN/);
  assert.match(readme, /\/mh-admin/);
});

function importFirebaseWithEnv(env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [
        "-e",
        `
          const fs = require('node:fs');
          const path = require('node:path');
          const Module = require('node:module');
          const ts = require('typescript');

          const firebasePath = path.join(process.cwd(), 'lib/firebase.ts');
          const source = fs.readFileSync(firebasePath, 'utf8');
          const compiled = ts.transpileModule(source, {
            compilerOptions: {
              module: ts.ModuleKind.CommonJS,
              target: ts.ScriptTarget.ES2019,
              esModuleInterop: true,
            },
            fileName: firebasePath,
          });

          const runtimeModule = new Module(firebasePath, module);
          runtimeModule.filename = firebasePath;
          runtimeModule.paths = Module._nodeModulePaths(path.dirname(firebasePath));
          runtimeModule._compile(compiled.outputText, firebasePath);

          const loaded = runtimeModule.exports;

          console.log(JSON.stringify({
            firebaseApp: loaded.firebaseApp
              ? { name: loaded.firebaseApp.name, options: loaded.firebaseApp.options }
              : null,
            firebaseAuth: loaded.firebaseAuth ? { appName: loaded.firebaseAuth.app.name } : null,
            firebaseDb: loaded.firebaseDb ? { appName: loaded.firebaseDb.app.name } : null,
            firebaseStorage: loaded.firebaseStorage ? { appName: loaded.firebaseStorage.app.name } : null,
          }));
        `,
      ],
      {
        cwd: new URL("..", import.meta.url),
        env: {
          ...process.env,
          NEXT_PUBLIC_FIREBASE_API_KEY: "",
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "",
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: "",
          NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "",
          NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "",
          NEXT_PUBLIC_FIREBASE_APP_ID: "",
          ...env,
        },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`firebase import failed with code ${code}: ${stderr}`));
        return;
      }

      resolve(JSON.parse(stdout.trim()));
    });
  });
}

test("firebase contract is import-safe without public config and initializes services when config is present", async () => {
  const packageJson = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );

  assert.equal(packageJson.dependencies?.firebase !== undefined, true);

  const firebasePath = new URL("../lib/firebase.ts", import.meta.url);
  assert.equal(existsSync(firebasePath), true);

  const missingConfigResult = await importFirebaseWithEnv();

  assert.equal(missingConfigResult.firebaseApp, null);
  assert.equal(missingConfigResult.firebaseAuth, null);
  assert.equal(missingConfigResult.firebaseDb, null);
  assert.equal(missingConfigResult.firebaseStorage, null);

  const whitespaceConfigResult = await importFirebaseWithEnv({
    NEXT_PUBLIC_FIREBASE_API_KEY: "   ",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "   ",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: "   ",
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "   ",
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "   ",
    NEXT_PUBLIC_FIREBASE_APP_ID: "   ",
  });

  assert.equal(whitespaceConfigResult.firebaseApp, null);
  assert.equal(whitespaceConfigResult.firebaseAuth, null);
  assert.equal(whitespaceConfigResult.firebaseDb, null);
  assert.equal(whitespaceConfigResult.firebaseStorage, null);

  const configuredResult = await importFirebaseWithEnv({
    NEXT_PUBLIC_FIREBASE_API_KEY: "test-api-key",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "demo.firebaseapp.com",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: "demo-project",
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "demo.appspot.com",
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "1234567890",
    NEXT_PUBLIC_FIREBASE_APP_ID: "1:1234567890:web:abcdef",
  });

  assert.deepEqual(configuredResult.firebaseApp, {
    name: "[DEFAULT]",
    options: {
      apiKey: "test-api-key",
      authDomain: "demo.firebaseapp.com",
      projectId: "demo-project",
      storageBucket: "demo.appspot.com",
      messagingSenderId: "1234567890",
      appId: "1:1234567890:web:abcdef",
    },
  });
  assert.deepEqual(configuredResult.firebaseAuth, { appName: "[DEFAULT]" });
  assert.deepEqual(configuredResult.firebaseDb, { appName: "[DEFAULT]" });
  assert.deepEqual(configuredResult.firebaseStorage, { appName: "[DEFAULT]" });
});
