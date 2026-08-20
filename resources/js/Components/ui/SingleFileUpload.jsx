import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function SingleFileUpload({
    initialFile = null,
    selectedFile = null,
    onChange = () => {},
    inputId = "single-file-upload",
    accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
    maxSize = 100 * 1024 * 1024,
    disabled = false,
}) {
    const { t } = useTranslation();
    const [fileData, setFileData] = useState(null);
    const [fileError, setFileError] = useState("");

    useEffect(() => {
        if (typeof File !== "undefined" && selectedFile instanceof File) {
            setFileData({
                name: selectedFile.name,
                file: selectedFile,
                url: URL.createObjectURL(selectedFile),
                existing: false,
            });
            return;
        }

        if (!initialFile) return;

        setFileData({
            name:
                typeof initialFile === "string"
                    ? initialFile.split("/").pop()
                    : "",
            url: initialFile,
            existing: true,
        });
    }, [initialFile, selectedFile]);

    const handleChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;
        if (file.size > maxSize) {
            setFileError(t("File size must not exceed 100 MB."));
            return;
        }

        setFileError("");

        setFileData({
            name: file.name,
            file,
            existing: false,
        });

        onChange(file);
    };

    const removeFile = () => {
        setFileData(null);
        onChange(null);
    };

    return (
        <>
            <label
                htmlFor={inputId}
                className={`file-upload-trigger ${disabled ? "disabled" : ""}`}
            >
                <span className="file-upload-icon">
                    <Icon icon="solar:cloud-upload-linear" width="22" />
                </span>
                <span>
                    <strong className="d-block">{t("Select File")}</strong>
                    <small>{t("PDF, DOC, DOCX, JPG, PNG up to 100 MB")}</small>
                </span>
                <input
                    hidden
                    id={inputId}
                    type="file"
                    accept={accept}
                    onChange={handleChange}
                    disabled={disabled}
                />
            </label>

            {fileError && <div className="text-danger small mb-2">{fileError}</div>}

            {fileData && (
                <div className="file-uploaded-item">
                    {/\.(jpg|jpeg|png|gif|webp)$/i.test(fileData.name) && fileData.url ? (
                        <img src={fileData.url} alt={fileData.name} className="file-upload-preview" />
                    ) : (
                        <Icon icon="ph:file-text" width="20" />
                    )}
                    <span className="text-truncate">{fileData.name}</span>
                    {!disabled && <button type="button" className="file-upload-remove" onClick={removeFile} aria-label={t("Remove")}>
                        <Icon
                            icon="radix-icons:cross-2"
                            width="18"
                        />
                    </button>}
                </div>
            )}
        </>
    );
}
