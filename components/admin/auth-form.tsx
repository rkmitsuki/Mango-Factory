"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";

export function AdminAuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!firebaseAuth) {
      setError("Firebase auth is not configured.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-auth-card">
      <div className="admin-auth-copy">
        <p className="label">Hidden admin</p>
        <h1 className="display-section text-balance">Sign in to edit the live menu.</h1>
        <p>
          Use a Firebase email/password account. There is no registration flow in the site.
        </p>
        <p>
          After sign-in, you can upload menu photos, replace image URLs, change pricing,
          edit tags, and reorder sections and items.
        </p>
      </div>

      <form className="admin-form-grid" onSubmit={handleSubmit}>
        <label className="admin-field">
          <span>Email</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="owner@example.com"
            required
          />
        </label>

        <label className="admin-field">
          <span>Password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            required
          />
        </label>

        {error ? <p className="admin-error">{error}</p> : null}

        <button className="button button-primary" type="submit" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
