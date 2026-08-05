import { SITE } from "@/config/site";
import type { TrackingContext, TrackingEvent, TrackingEventName } from "@/types";

const STORAGE_KEY = "rz.tracking.context";
const EVENTS_KEY = "rz.tracking.events";

const detectDevice = (): TrackingContext["deviceType"] => {
  if (typeof window === "undefined") return undefined;
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1180) return "tablet";
  return "desktop";
};

const detectBrowser = (ua: string) => {
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("Chrome/")) return "Chrome";
  if (ua.includes("Safari/")) return "Safari";
  if (ua.includes("Firefox/")) return "Firefox";
  return "Outro";
};

const detectOs = (ua: string) => {
  if (ua.includes("Android")) return "Android";
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac OS")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  return "Outro";
};

function readStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Captura e persiste o contexto de aquisição da visita. */
export function captureTracking(): TrackingContext {
  if (typeof window === "undefined") return {};
  const stored = readStored<TrackingContext>(STORAGE_KEY, {});
  const params = new URLSearchParams(window.location.search);
  const param = (name: string) => params.get(name) ?? undefined;
  const ua = window.navigator.userAgent;

  const context: TrackingContext = {
    ...stored,
    utmSource: param("utm_source") ?? stored.utmSource,
    utmMedium: param("utm_medium") ?? stored.utmMedium,
    utmCampaign: param("utm_campaign") ?? stored.utmCampaign,
    utmTerm: param("utm_term") ?? stored.utmTerm,
    utmContent: param("utm_content") ?? stored.utmContent,
    gclid: param("gclid") ?? stored.gclid,
    gbraid: param("gbraid") ?? stored.gbraid,
    wbraid: param("wbraid") ?? stored.wbraid,
    fbclid: param("fbclid") ?? stored.fbclid,
    referrer: stored.referrer ?? document.referrer,
    landingPage: stored.landingPage ?? window.location.pathname,
    deviceType: detectDevice(),
    browser: detectBrowser(ua),
    operatingSystem: detectOs(ua),
    firstVisitAt: stored.firstVisitAt ?? new Date().toISOString(),
    conversionPage: window.location.pathname,
    consentVersion: SITE.consentVersion,
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(context));
  } catch {
    /* armazenamento indisponível */
  }
  return context;
}

/** Registro simulado de eventos. A integração real será feita no backend. */
export function trackEvent(name: TrackingEventName, payload?: TrackingEvent["payload"]): void {
  if (typeof window === "undefined") return;
  const event: TrackingEvent = {
    name,
    ...(payload ? { payload } : {}),
    occurredAt: new Date().toISOString(),
  };
  const events = readStored<TrackingEvent[]>(EVENTS_KEY, []);
  events.unshift(event);
  try {
    window.localStorage.setItem(EVENTS_KEY, JSON.stringify(events.slice(0, 120)));
  } catch {
    /* armazenamento indisponível */
  }
}

export const trackingHistory = (): TrackingEvent[] => readStored<TrackingEvent[]>(EVENTS_KEY, []);

export const trackingService = {
  capture: captureTracking,
  track: trackEvent,
  history: trackingHistory,
};
