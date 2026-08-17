import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function SingleImageUpload({
    initialImage = null,
    onChange = () => {},
}) {
    const { t } = useTranslation();
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        setPreview(initialImage);
    }, [initialImage]);

    const handleChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setPreview(URL.createObjectURL(file));
        onChange(file);
    };

    const removeImage = () => {
        setPreview(null);
        onChange(null);
    };

    return (
        <div className="upload-image-wrapper">
            {preview ? (
                <div className="position-relative h-120-px w-120-px border input-form-light radius-8 overflow-hidden border-dashed bg-neutral-50">
                    <button
                        type="button"
                        className="uploaded-img__remove position-absolute top-0 end-0 z-1 me-8 mt-8 d-flex"
                        onClick={removeImage}
                    >
                        <Icon
                            icon="radix-icons:cross-2"
                            className="text-danger-600"
                        />
                    </button>

                    <img
                        src={preview}
                        className="w-100 h-100 object-fit-cover"
                        alt=""
                    />
                </div>
            ) : (
                <label className="upload-file-multiple h-120-px w-120-px border input-form-light radius-8 overflow-hidden border-dashed bg-neutral-50 bg-hover-neutral-200 d-flex align-items-center flex-column justify-content-center gap-1">
                    <Icon icon="solar:camera-outline" />
                    <span>{t("Upload")}</span>

                    <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                    />
                </label>
            )}
        </div>
    );
}
