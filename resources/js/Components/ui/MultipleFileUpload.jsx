import { useId } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";

export default function MultipleFileUpload({
    initialFileUrls = [],
    data,
    setData,
    fieldName,
    maxFiles = 5,
    allowedFileTypes = null,
    maxSize = 100 * 1024 * 1024,
}) {
    const { t } = useTranslation();
    const inputId = useId();
    const files = Array.isArray(data) ? data : [];
    const addFiles = (event) => {
        const remaining = Math.max(maxFiles - files.length, 0);
        const selected = Array.from(event.target.files ?? [])
            .filter((file) => file.size <= maxSize)
            .slice(0, remaining);
        setData(fieldName, [...files, ...selected]);
        event.target.value = "";
    };

    return <label htmlFor={inputId} className="file-upload-trigger file-upload-trigger-multiple mb-3">
        <span className="file-upload-icon">
            <Icon icon="solar:cloud-upload-linear" width="22" />
        </span>
        <span>
            <strong className="d-block">{t("Select Files")}</strong>
            <small>{t("Add supporting evidence")}</small>
        </span>
        <input id={inputId} type="file" className="d-none" multiple accept={(allowedFileTypes ?? []).join(",")} onChange={addFiles} disabled={files.length >= maxFiles} />
    </label>;
}
