import { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabaseClient";
import SunriseBackground from "./SunriseBackground";
import "./App.css";
import Nav from "./Nav";
import "./Nav.css";

function getRemaining(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    done: diff === 0,
  };
}

export default function App() {
  const [retirementDate, setRetirementDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(() => getRemaining(new Date()));

  // Fetch the date once on mount.
  useEffect(() => {
    async function fetchDate() {
      const { data, error } = await supabase
        .from("retirement_settings")
        .select("retirement_date")
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        setError("Couldn't load the retirement date.");
        return;
      }
      setRetirementDate(new Date(data.retirement_date));
    }
    fetchDate();
  }, []);

  // Tick every second once we have a date.
  useEffect(() => {
    if (!retirementDate) return;
    setRemaining(getRemaining(retirementDate));
    const id = setInterval(() => {
      setRemaining(getRemaining(retirementDate));
    }, 1000);
    return () => clearInterval(id);
  }, [retirementDate]);

  const units = useMemo(
    () => [
      { label: "Days", value: remaining.days },
      { label: "Hours", value: remaining.hours },
      { label: "Minutes", value: remaining.minutes },
      { label: "Seconds", value: remaining.seconds },
    ],
    [remaining]
  );

  const formattedDate = retirementDate
    ? retirementDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <main className="page">
      <Nav current="main" />
      <SunriseBackground />
      <div className="content">
      <div className="card">
        <p className="eyebrow">Retirement</p>

        {error ? (
          <h1 className="headline">{error}</h1>
        ) : !retirementDate ? (
          <h1 className="headline">Loading…</h1>
        ) : (
          <>
            <h1 className="headline">
              {remaining.done ? "Today's the day." : "Free as of"}
            </h1>
            <p className="date">{formattedDate}</p>

            <div className="ledger">
              {units.map((unit) => (
                <div className="unit" key={unit.label}>
                  <span className="unit-value">
                    {String(unit.value).padStart(2, "0")}
                  </span>
                  <span className="unit-label">{unit.label}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      </div>
    </main>
  );
}