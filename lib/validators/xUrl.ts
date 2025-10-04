// lib/validators/xUrl.ts
function normalizeHost(host: string) {
  return host.replace(/^mobile\./, "").replace(/^www\./, "");
}

export function isXHost(host: string) {
  const h = normalizeHost(host);
  return h === "x.com" || h === "twitter.com";
}

export function isValidXUrl(u: string) {
  try {
    const url = new URL(u);
    return isXHost(url.hostname);
  } catch {
    return false;
  }
}

export function isProfileUrl(u: string) {
  try {
    const url = new URL(u);
    if (!isXHost(url.hostname)) return false;
    const parts = url.pathname.split("/").filter(Boolean);
    return parts.length === 1; // /username
  } catch {
    return false;
  }
}

export function isStatusUrl(u: string) {
  try {
    const url = new URL(u);
    if (!isXHost(url.hostname)) return false;
    const parts = url.pathname.split("/").filter(Boolean);
    const i = parts.findIndex((p) => p === "status");
    return i >= 1 && !!parts[i + 1]; // /{user}/status/{id}
  } catch {
    return false;
  }
}
