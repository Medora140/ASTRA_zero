"use client";

import { useEffect, useState } from "react";
import { event } from "@/lib/event";

type Remaining = { days: number; hours: number; minutes: number; seconds: number; started: boolean };

function getRemaining(): Remaining {
  const milliseconds = new Date(event.dateTime).getTime() - Date.now();
  if (milliseconds <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, started: true };
  const totalSeconds = Math.floor(milliseconds / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    started: false,
  };
}

export function Countdown() {
  const [remaining, setRemaining] = useState<Remaining>({ days: 0, hours: 0, minutes: 0, seconds: 0, started: false });

  useEffect(() => {
    const update = () => setRemaining(getRemaining());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (remaining.started) return <p className="countdown-live" aria-live="polite">MISSION DAY IS HERE</p>;

  const units = [
    [remaining.days, "DAYS"],
    [remaining.hours, "HRS"],
    [remaining.minutes, "MIN"],
    [remaining.seconds, "SEC"],
  ] as const;

  return (
    <div className="countdown" aria-label={`${remaining.days} days until the event`}>
      {units.map(([value, label]) => (
        <span className="countdown-unit" key={label}>
          <strong>{String(value).padStart(2, "0")}</strong><small>{label}</small>
        </span>
      ))}
    </div>
  );
}
