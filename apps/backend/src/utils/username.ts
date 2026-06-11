export function extractUsername(url: string): string {
  return url.replace(/\/$/, "").split("/").pop() ?? "";
}
