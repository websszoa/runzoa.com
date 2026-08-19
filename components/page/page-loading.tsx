"use client";

import { useEffect, useState } from "react";

const MIN_LOADING_DURATION_MS = 1000;
const FADE_DURATION_MS = 300;

export function PageLoading() {
  const [closing, setClosing] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const startedAt = performance.now();
    let closeTimer: number | undefined;
    let removeTimer: number | undefined;
    let cancelled = false;

    const pageReady =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            window.addEventListener("load", () => resolve(), { once: true });
          });

    Promise.all([pageReady, document.fonts.ready]).then(() => {
      if (cancelled) return;

      const remaining = Math.max(
        0,
        MIN_LOADING_DURATION_MS - (performance.now() - startedAt),
      );

      closeTimer = window.setTimeout(() => {
        setClosing(true);
        removeTimer = window.setTimeout(
          () => setVisible(false),
          FADE_DURATION_MS,
        );
      }, remaining);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(closeTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-label="페이지를 불러오는 중"
      className={
        closing
          ? "page-loading page-loading--closing"
          : "page-loading"
      }
    >
      <div className="loading" aria-hidden="true" />
    </div>
  );
}
