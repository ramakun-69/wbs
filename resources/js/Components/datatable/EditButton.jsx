import { Icon } from "@iconify/react";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

export default function EditButton({ type, isLoading, loadingText = false, children, ...props }) {
    const { t } = useTranslation()
    return (
        <>
            <button
                type={type}
                className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                disabled={isLoading}
                title={t('Edit')}
                {...props}
            >
                {isLoading ? (
                    <>
                        <Icon icon="line-md:loading-loop" className=" me-2" width="20" height="20" />
                        {loadingText ? t('Loading') : ""}
                    </>
                ) : (
                    <>
                        <Icon icon="lucide:edit" className="me-2 " width="20" height="20" />
                        {children}
                    </>
                )}
            </button>
        </>
    );
}