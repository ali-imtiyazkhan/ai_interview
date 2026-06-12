export function extractUsername(url: string): string {
  try {
    const path = new URL(url).pathname.replace(/\/$/, "");
    const parts = path.split("/").filter(Boolean);
    return parts[parts.length - 1] ?? "";
  } catch {
    const clean = url.replace(/\/$/, "");
    const parts = clean.split("/").filter(Boolean);
    return parts[parts.length - 1] ?? "";
  }
}
