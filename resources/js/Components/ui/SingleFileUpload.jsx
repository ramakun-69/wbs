import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function SingleFileUpload({
    initialFile = null,
    onChange = () => {},
}) {
    const { t } = useTranslation();
    const [fileData, setFileData] = useState(null);

    useEffect(() => {
        if (!initialFile) return;

        setFileData({
            name:
                typeof initialFile === "string"
                    ? initialFile.split("/").pop()
                    : "",
            url: initialFile,
            existing: true,
        });
    }, [initialFile]);

    const handleChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

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
                htmlFor="single-file-upload"
                className="mb-16 border border-neutral-600 fw-medium text-secondary-light px-16 py-12 radius-12 d-inline-flex align-items-center gap-2 bg-hover-neutral-200"
            >
                <Icon icon="solar:upload-linear" />
                {t("Select File")}
                <input
                    hidden
                    id="single-file-upload"
                    type="file"
                    onChange={handleChange}
                />
            </label>

            {fileData && (
                <ul className="show-uploaded-img-name">
                    <li className="uploaded-image-name-list text-primary-600 fw-semibold d-flex align-items-center gap-2">
                        <Icon icon="ph:file-light" />

                        {fileData.name}

                        <Icon
                            icon="radix-icons:cross-2"
                            className="text-danger-600"
                            onClick={removeFile}
                            style={{ cursor: "pointer" }}
                        />
                    </li>
                </ul>
            )}
        </>
    );
}
