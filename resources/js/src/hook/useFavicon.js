import { useEffect } from "react";

export default function useFavicon(href) {
    useEffect(() => {
        if (!href) return;
        let link = document.querySelector("link[rel='icon']");
        if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
        }

        link.href = href;
    }, [href]);
}