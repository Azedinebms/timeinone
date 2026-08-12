"use client";

import { useEffect, useState } from "react";

export function useCurrentTime(interval = 1000) {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    const updateTime = () => {
      setCurrentDate(new Date());
    };

    updateTime();

    const timer = window.setInterval(updateTime, interval);

    return () => {
      window.clearInterval(timer);
    };
  }, [interval]);

  return currentDate;
}