"use client";

import { useEffect, useState } from "react";
import { copy } from "@/content/copy";

const MESSAGES = copy.announcement;
const INTERVAL = 4000;

export function AnnouncementBar() {
  const [idx, setIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % MESSAGES.length);
    }, INTERVAL);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="w-full bg-twilight text-on-brand text-sm text-center py-2 px-4 overflow-hidden"
      style={{ height: "36px" }}
      aria-live="polite"
      suppressHydrationWarning
    >
      <span className="block" suppressHydrationWarning>
        {mounted ? MESSAGES[idx] : MESSAGES[0]}
      </span>
    </div>
  );
}
