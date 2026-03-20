"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    __MSW_READY__?: Promise<void>;
  }
}

function shouldEnableMock() {
  return process.env.NEXT_PUBLIC_ENABLE_MSW === "true";
}

export default function MSWProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(!shouldEnableMock());

  useEffect(() => {
    if (!shouldEnableMock()) return;

    if (!window.__MSW_READY__) {
      window.__MSW_READY__ = import("@/mocks/browser")
        .then(({ worker }) =>
          worker.start({
            onUnhandledRequest: "bypass",
            serviceWorker: {
              url: "/mockServiceWorker.js",
            },
          }),
        )
        .then(() => undefined);
    }

    window.__MSW_READY__.then(() => setReady(true));
  }, []);

  if (!ready) return null;

  return <>{children}</>;
}
