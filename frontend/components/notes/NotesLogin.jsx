"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@frontend/components/notes/ui/button";
import { Input } from "@frontend/components/notes/ui/input";

function safeDestination(value) {
  if (
    value &&
    value.startsWith("/notes") &&
    !value.startsWith("//") &&
    !value.startsWith("/notes/login")
  ) {
    return value;
  }
  return "/notes";
}

export default function NotesLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const destination = safeDestination(searchParams.get("next"));

  async function submit(event) {
    event.preventDefault();
    const password = String(new FormData(event.currentTarget).get("password") || "");
    if (!password || submitting) return;
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/notes/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result?.error || "Unable to sign in.");
        return;
      }

      router.replace(destination);
      router.refresh();
    } catch {
      setError("Unable to reach crew notes. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-shell">
      <section className="login-card" aria-labelledby="login-title">
        <a className="brand" href="/">
          <span className="brand-icon">MM</span> crew notes
          <span className="brand-dot">.</span>
        </a>
        <p className="eyebrow">PRIVATE MM CAR CARE WORKSPACE</p>
        <h1 id="login-title">Crew access</h1>
        <p className="login-copy">
          Enter the owner and crew password to open notes on this device.
        </p>
        <form action="/api/notes/session" method="post" onSubmit={submit}>
          <input type="hidden" name="next" value={destination} />
          <label htmlFor="crew-password">Password</label>
          <Input
            id="crew-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            autoFocus
          />
          {(error || searchParams.get("error") === "password") && (
            <p className="error" role="alert">
              {error || "Incorrect password."}
            </p>
          )}
          <Button className="save-button" type="submit" disabled={submitting}>
            {submitting ? "Checking…" : "Open crew notes"}
          </Button>
        </form>
        <p className="login-note">
          Access is protected by a secure server session. Notes themselves are
          stored only in this browser and do not sync across devices.
        </p>
      </section>
    </main>
  );
}
