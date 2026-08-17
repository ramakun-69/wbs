if (typeof window !== "undefined") {
    const getCsrfToken = () => {
        return document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");
    };

    const originalFetch = window.fetch;

    window.fetch = async function (url, options = {}) {
        const token = getCsrfToken();

        const method = (options.method || "GET").toUpperCase();

        if (token && method !== "GET" && method !== "HEAD") {
            options.headers = options.headers || {};

            options.headers["X-CSRF-TOKEN"] = token;

            if (
                options.body &&
                !(options.body instanceof FormData) &&
                !options.headers["Content-Type"]
            ) {
                options.headers["Content-Type"] = "application/json";
            }
        }

        return originalFetch(url, options);
    };
}