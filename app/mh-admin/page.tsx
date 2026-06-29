"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { AdminAuthForm } from "@/components/admin/auth-form";
import { AdminMenuEditor } from "@/components/admin/menu-editor";
import { firebaseAuth } from "@/lib/firebase";

export default function HiddenAdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(() => !firebaseAuth);

  useEffect(() => {
    if (!firebaseAuth) {
      return;
    }

    return onAuthStateChanged(firebaseAuth, (nextUser) => {
      setUser(nextUser);
      setReady(true);
    });
  }, []);

  return (
    <main className="subpage-main admin-page">
      {!ready ? (
        <section className="section-shell admin-loading">
          <p>Loading...</p>
        </section>
      ) : user ? (
        <AdminMenuEditor />
      ) : (
        <section className="section-shell admin-auth-shell">
          <AdminAuthForm />
        </section>
      )}
    </main>
  );
}
