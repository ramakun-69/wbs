import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

export default function ShowButton({ type,isLoading, children, ...props }) {
    return (
        <>
            <button
                type={type}
                className="w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"
                disabled={isLoading}
                {...props}
            >
                {isLoading ? (
                    <>
                        <Icon icon="line-md:loading-loop" className=" me-2" width="20" height="20" />
                        Loading...
                    </>
                ) : (
                    <>
                        <Icon icon="iconamoon:eye-light" className="me-2 " width="20" height="20" />
                        {children}
                    </>
                )}
            </button>
        </>
    );
}