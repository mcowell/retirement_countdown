import { useEffect, useMemo, useState } from "react";
import "./App.css";

// Edit this to your actual retirement date/time.
const RETIREMENT_DATE = new Date("2026-08-24T16:00:00");

function getRemaining(target) {
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

const formattedDate = RETIREMENT_DATE.toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function App() {
  const [remaining, setRemaining] = useState(() => getRemaining(RETIREMENT_DATE));

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(getRemaining(RETIREMENT_DATE));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const units = useMemo(
    () => [
      { label: "Days", value: remaining.days },
      { label: "Hours", value: remaining.hours },
      { label: "Minutes", value: remaining.minutes },
      { label: "Seconds", value: remaining.seconds },
    ],
    [remaining]
  );

  return (
    <main className="page">
      <div className="card">
        <p className="eyebrow">Matthew's Retirement</p>
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

        <div className="horizon" aria-hidden="true">
          <div className="sun" />
        </div>
      </div>
    </main>
  );
}