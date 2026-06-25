import { useState, type FormEvent } from "react";

export default function AdminPage() {
  const [date, setDate] = useState("");
  const [label, setLabel] = useState("Retirement");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/update-date", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          retirement_date: new Date(date).toISOString(),
          label,
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
      <form onSubmit={handleSubmit} className="admin-form">
        <h1>Update Retirement Date</h1>

        <label>
          Date &amp; time
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>

        <label>
          Label
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </label>

        <button type="submit" disabled={status === "saving"}>
          {status === "saving" ? "Saving…" : "Save"}
        </button>

        {message && <p className={`status ${status}`}>{message}</p>}
      </form>
    </main>
  );
}