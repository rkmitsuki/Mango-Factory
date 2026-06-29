"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase";
import { fallbackMenuSections, parseMenuContentDocument, type MenuSection } from "@/lib/menu-content";

export function useLiveMenuSections() {
  const [sections, setSections] = useState<MenuSection[]>(fallbackMenuSections);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!firebaseDb) {
        return;
      }

      try {
        const snapshot = await getDoc(doc(firebaseDb, "site-content", "menu"));

        if (!snapshot.exists()) {
          return;
        }

        const parsed = parseMenuContentDocument(snapshot.data());

        if (!parsed || cancelled) {
          return;
        }

        setSections(parsed.sections);
      } catch {
        // Keep fallback content on public pages when Firestore is unavailable.
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return sections;
}
