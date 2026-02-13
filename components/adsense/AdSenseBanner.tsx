"use client";

import { useEffect } from "react";

/** ID do cliente AdSense (ex: ca-pub-1234567890123456) */
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
/** ID do slot do anúncio (opcional, para unidades específicas) */
const ADSENSE_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID;

/**
 * Banner horizontal do Google AdSense (leaderboard/responsivo).
 * O script AdSense deve estar no <head> (configurado no layout).
 */
export function AdSenseBanner() {
  useEffect(() => {
    try {
      const w = window as Window & { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {
      // ignorar em SSR ou se o script ainda não carregou
    }
  }, []);

  if (!ADSENSE_CLIENT) return null;

  return (
    <div className="w-full flex justify-center py-4 min-h-[90px] bg-default-50/50">
        <ins
          className="adsbygoogle block"
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={ADSENSE_SLOT || undefined}
          data-ad-format="horizontal"
          data-full-width-responsive="true"
          style={{ display: "block", minHeight: 90 }}
        />
    </div>
  );
}
