import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import "react-quill-new/dist/quill.snow.css";
import "../css/dashboard/app.scss";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/id";
import "dayjs/locale/en";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "./csrf.js";
import "./i18n.js";
import i18n from "./i18n";
import { route } from "ziggy-js";
import "../css/datatable.css";
import "../css/custom.css";
import "../css/public.css";
import "./axios";
import GlobalLoading from "./Components/ui/GlobalLoading.jsx";

// Expose Ziggy's route helper to all Inertia page components.
globalThis.route = route;

if (typeof window !== "undefined") {
    import("bootstrap/dist/js/bootstrap.bundle.js");
}
createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale={i18n.resolvedLanguage || "en"}
            >
                <App {...props} />
                <GlobalLoading />
                <ToastContainer />
            </LocalizationProvider>,
        );
    },
    progress: {
        color: "#166275",
        delay: 0,
        showSpinner: false,
        includeCSS: true,
    },
});
