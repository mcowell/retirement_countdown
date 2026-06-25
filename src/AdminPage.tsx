import { useEffect, useRef, useState, type FormEvent } from "react";
import "./AdminPage.css";

export default function AdminPage() {
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
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
    setStatus("saving");
    try {
      const res = await fetch("/api/update-date", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  return (
    <main className="admin-page">
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

        <button type="submit" className="admin-button" disabled={status === "saving"}>
          {status === "saving" ? "Saving…" : "Save"}
        </button>

        {message && <p className={`admin-status admin-status--${status}`}>{message}</p>}
      </form>
    </main>
  );
}