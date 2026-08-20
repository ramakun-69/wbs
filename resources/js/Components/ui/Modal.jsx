// components/ui/AppModal.jsx
import { Modal as BootstrapModal } from "react-bootstrap";
import Button from "./Button";
import { useTranslation } from "react-i18next";

export default function Modal({ show, onClose, title, onSave, children, saveText, processing = false, size = 'md', fullscreen = false, centered = false, hideFooter = false, className = '', bodyClassName = '' }) {
    const { t } = useTranslation();
    return (
        <BootstrapModal show={show} onHide={onClose} size={size} fullscreen={fullscreen} centered={centered} dialogClassName={className}>
            <BootstrapModal.Header closeButton>
                <BootstrapModal.Title className="text-xl">{title}</BootstrapModal.Title>
            </BootstrapModal.Header>
            <BootstrapModal.Body className={bodyClassName}>{children}</BootstrapModal.Body>
            {!hideFooter && (
                <BootstrapModal.Footer>
                    <Button type="button" className="btn btn-sm btn-danger" onClick={onClose}>
                        {t('Cancel')}
                    </Button>
                    <Button type="button" className="btn btn-sm btn-primary" isLoading={processing} onClick={onSave}>
                        {saveText ?? t('Save')}
                    </Button>
                </BootstrapModal.Footer>
            )}
        </BootstrapModal>
    );
}
