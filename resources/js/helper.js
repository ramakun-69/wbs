import i18n from "./i18n";

const localeMap = {
    id: "id-ID",
    en: "en-GB",
};

const getLocale = () => {
    const lang = (
        i18n.resolvedLanguage ??
        i18n.language ??
        "en"
    ).split("-")[0];

    return localeMap[lang] ?? "en-GB";
};

function formatDate(date,{withWeekday = false,shortMonth = false} = {}) {
    if (!date) return "-";
    return new Intl.DateTimeFormat(getLocale(), {
        ...(withWeekday && { weekday: "long" }),
       day: "2-digit",
        month: shortMonth ? "short" : "long",
        year: "numeric",
    }).format(new Date(date));
}

function formatPlaceDate(place, date) {
    if (!place && !date) return "-";

    const lang = (
        i18n.resolvedLanguage ??
        i18n.language ??
        "en"
    ).split("-")[0];

    const formattedDate = formatDate(date);

    return lang === "id"
        ? `${place}, ${formattedDate}`
        : `${formattedDate}, ${place}`;
}

function formatDateTime(date) {
    if (!date) return "-";

    return new Intl.DateTimeFormat(getLocale(), {
        year: "numeric",
        month: "long",
       day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
}

export {
    formatDate,
    formatPlaceDate,
    formatDateTime,
};