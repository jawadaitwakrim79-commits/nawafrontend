"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { flushPixelQueue, trackPageView } from "@/lib/tracking";

const META_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const TT_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
const SNAP_ID = process.env.NEXT_PUBLIC_SNAP_PIXEL_ID;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

export function PixelLoader() {
  const pathname = usePathname();
  const prevPath = useRef<string | null>(null);

  // SPA pageview on route change
  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    const eid = crypto.randomUUID();
    const url = window.location.href;
    // Queue and try to flush — pixels may not be loaded yet on first render
    trackPageView(eid, url);
    // Post to CAPI (best effort)
    void import("@/lib/api").then(({ sendEvent }) => {
      sendEvent({ event_name: "PageView", event_id: eid, page_url: url });
    });
  }, [pathname]);

  // Read ttclid and sc_cid from query on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ttclid = params.get("ttclid");
    if (ttclid) {
      const exp = Date.now() + 28 * 24 * 60 * 60 * 1000;
      localStorage.setItem("nawa_ttclid", ttclid);
      localStorage.setItem("nawa_ttclid_exp", String(exp));
    }
    const scCid = params.get("ScCid") || params.get("sccid");
    if (scCid) localStorage.setItem("nawa_sc_cid", scCid);

    // Set nawa_eid if not present
    if (!localStorage.getItem("nawa_eid")) {
      localStorage.setItem("nawa_eid", crypto.randomUUID());
    }

    // Set _fbc from fbclid if not present
    const fbclid = params.get("fbclid");
    if (fbclid && !document.cookie.includes("_fbc")) {
      const fbc = `fb.1.${Date.now()}.${fbclid}`;
      document.cookie = `_fbc=${encodeURIComponent(fbc)};path=/;max-age=${90 * 86400};SameSite=Lax`;
    }
  }, []);

  return (
    <>
      {META_ID && (
        <Script
          id="meta-pixel"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_ID}');
if(window.__nawaPixelQueue){window.__nawaPixelQueue.forEach(function(c){if(c.platform==='meta'){fbq('track',c.name,c.payload,{eventID:c.eventId});}});}
window.__nawaPixelReady = window.__nawaPixelReady || {};
window.__nawaPixelReady.meta = true;
            `,
          }}
        />
      )}

      {TT_ID && (
        <Script
          id="tiktok-pixel"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)},ttq.load('${TT_ID}');
if(window.__nawaPixelQueue){window.__nawaPixelQueue.forEach(function(c){if(c.platform==='tiktok'){ttq.track(c.name,c.payload,{event_id:c.eventId});}});}
window.__nawaPixelReady = window.__nawaPixelReady || {};
window.__nawaPixelReady.tiktok = true;
            `,
          }}
        />
      )}

      {SNAP_ID && (
        <Script
          id="snap-pixel"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};a.queue=[];var s='script';r=t.createElement(s);r.async=!0;r.src=n;var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u);})(window,document,'https://sc-static.net/scevent.min.js');
snaptr('init','${SNAP_ID}');
if(window.__nawaPixelQueue){window.__nawaPixelQueue.forEach(function(c){if(c.platform==='snap'){snaptr('track',c.name,Object.assign({},c.payload,{client_dedup_id:c.eventId}));}});}
window.__nawaPixelReady = window.__nawaPixelReady || {};
window.__nawaPixelReady.snap = true;
            `,
          }}
        />
      )}
    </>
  );
}
