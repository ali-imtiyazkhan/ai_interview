export function getUsername(url: string) {
    return url.replace(/\/$/, "").split("/").pop();
}