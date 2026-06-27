import { useEffect, useRef, useState, type FormEvent } from "react";
import "./AdminPage.css";
import Nav from "./Nav";
import "./Nav.css";
import Footer from "./Footer";
import "./Footer.css";

import { useAuth } from "./useAuth";

const ADMIN_EMAIL = "mcowell@gmail.com";

export default function AdminPage() {
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-open the native picker on load (supported in Chrome/Edge; falls back
  // to a normal click-to-open input on Safari/Firefox).
  useEffect(() => {
    const el = inputRef.current;
    if (el && "showPicker" in el) {
      try {
        (el as any).showPicker();
      } catch {
        // Some browsers throw if not triggered by a direct user gesture —
        // safe to ignore, the input still works normally on click/focus.
      }
    }
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!session) return; 
    setStatus("saving");
    try {
      const res = await fetch("/api/update-date", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          retirement_date: new Date(date).toISOString(),
          label: "Retirement",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setStatus("success");
      setMessage("Retirement date updated.");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const { session, loading: authLoading, signInWithGoogle } = useAuth();

  if (authLoading) {
    return (
      <main className="admin-page">
        <Nav current="admin" />
        <div className="admin-content">
          <p className="admin-status">Checking sign-in…</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (!session) {
    return (
      <main className="admin-page">
        <Nav current="admin" />
        <div className="admin-content">
          <button className="admin-button" onClick={signInWithGoogle}>
            Sign in with Google
          </button>
        </div>
        <Footer />
      </main>
    );
  }

  if (session.user.email !== ADMIN_EMAIL) {
    return (
      <main className="admin-page">
        <Nav current="admin" />
        <div className="admin-content">
          <p className="admin-status admin-status--error">
            You're signed in, but this account isn't an admin.
          </p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="admin-page">
      <Nav current="admin" />
      <div className="admin-content">
        <form onSubmit={handleSubmit} className="admin-card">
          <p className="admin-eyebrow">Admin</p>
          <h1 className="admin-headline">Set a new date</h1>

          <input
            ref={inputRef}
            type="datetime-local"
            className="admin-date-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <button
            type="submit"
            className="admin-button"
            disabled={status === "saving"}
          >
            {status === "saving" ? "Saving…" : "Save"}
          </button>

          {message && (
            <p className={`admin-status admin-status--${status}`}>{message}</p>
          )}
        </form>
      </div>
      <Footer />
    </main>
  );
}
