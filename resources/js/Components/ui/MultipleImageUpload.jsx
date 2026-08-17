import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function MultipleImageUpload({
    initialImages = [],
    onChange = () => {},
}) {
    const {t} = useTranslation();
    const [images, setImages] = useState([]);

    useEffect(() => {
        const existing = initialImages.map((url) => ({
            id: crypto.randomUUID(),
            preview: url,
            file: null,
            existing: true,
        }));

        setImages(existing);
    }, [initialImages]);

    const handleChange = (e) => {
        const files = Array.from(e.target.files);

        const newImages = files.map((file) => ({
            id: crypto.randomUUID(),
            preview: URL.createObjectURL(file),
            file,
            existing: false,
        }));

        const updated = [...images, ...newImages];

        setImages(updated);

        onChange(updated.filter((x) => x.file).map((x) => x.file));
    };

    const removeImage = (id) => {
        const updated = images.filter((img) => img.id !== id);

        setImages(updated);

        onChange(updated.filter((x) => x.file).map((x) => x.file));
    };

    return (
        <div className="d-flex gap-3 flex-wrap">
            {images.map((image) => (
                <div
                    key={image.id}
                    className="position-relative h-120-px w-120-px border input-form-light radius-8 overflow-hidden border-dashed bg-neutral-50"
                >
                    <button
                        type="button"
                        className="position-absolute top-0 end-0 me-8 mt-8"
                        onClick={() => removeImage(image.id)}
                    >
                        <Icon icon="radix-icons:cross-2" />
                    </button>

                    <img
                        src={image.preview}
                        className="w-100 h-100 object-fit-cover"
                        alt=""
                    />
                </div>
            ))}

            <label className="upload-file-multiple h-120-px w-120-px border input-form-light radius-8 overflow-hidden border-dashed bg-neutral-50 d-flex align-items-center justify-content-center flex-column">
                <Icon icon="solar:camera-outline" />
                <span>{t("Upload")}</span>

                <input
                    hidden
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleChange}
                />
            </label>
        </div>
    );
}
