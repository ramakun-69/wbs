import { useEffect, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";

import Button from "../../Components/ui/Button";

export default function DrawerPanel({
    show,
    user,
    roles = [],
    onClose,
    onSubmit,
    isLoading = false,
}) {
    const { t } = useTranslation();
    const [selectedRoles, setSelectedRoles] = useState([]);

    useEffect(() => {
        if (show) {
            setSelectedRoles(user?.roles?.map((role) => role.name) ?? []);
        }
    }, [show, user]);

    const toggleRole = (roleName) => {
        setSelectedRoles((current) => current.includes(roleName)
            ? current.filter((name) => name !== roleName)
            : [...current, roleName]);
    };

    return (
        <Offcanvas
            show={show}
            onHide={onClose}
            placement="end"
            scroll
            backdrop="static"
            className="w-100"
            style={{ maxWidth: 560 }}
        >
            <Offcanvas.Header closeButton className="border-bottom px-4 py-3">
                <div>
                    <Offcanvas.Title className="fw-semibold">
                        {t("Assign Roles")}
                    </Offcanvas.Title>
                    <div className="text-muted small mt-1">
                        {user?.name} · {user?.email}
                    </div>
                </div>
            </Offcanvas.Header>

            <Offcanvas.Body className="d-flex flex-column p-0">
                <div className="flex-grow-1 overflow-auto px-4 py-3">
                    {roles.map((role) => {
                        const checked = selectedRoles.includes(role.name);

                        return (
                            <label
                                key={role.id}
                                htmlFor={`user-role-${role.id}`}
                                className="border rounded-3 p-3 mb-3 d-flex align-items-center gap-3 shadow-sm"
                            >
                                <input
                                    id={`user-role-${role.id}`}
                                    type="checkbox"
                                    className="form-check-input mt-0"
                                    checked={checked}
                                    onChange={() => toggleRole(role.name)}
                                    disabled={isLoading}
                                />
                                <span className="flex-grow-1 fw-semibold">
                                    {role.name}
                                </span>
                                <Icon icon="solar:shield-check-outline" width="22" height="22" className="text-primary" />
                            </label>
                        );
                    })}
                </div>

                <div className="border-top p-3 d-flex justify-content-end gap-2 bg-white">
                    <Button type="button" className="btn btn-light" onClick={onClose} disabled={isLoading}>
                        {t("Cancel")}
                    </Button>
                    <Button type="button" className="btn btn-primary" onClick={() => onSubmit(selectedRoles)} isLoading={isLoading}>
                        <Icon icon="material-symbols-light:save-outline-rounded" className="me-2" width="20" height="20" />
                        {t("Save")}
                    </Button>
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    );
}
