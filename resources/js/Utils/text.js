export function stripHtml(value = "") {
    if (!value) return "";
    if (typeof window === "undefined") {
        return String(value).replace(/<[^>]*>/g, "").trim();
    }

    const document = new DOMParser().parseFromString(String(value), "text/html");
    return document.body.textContent?.trim() ?? "";
}
