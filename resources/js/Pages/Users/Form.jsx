import Select from "react-select";
import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Form({data, setData, errors, selectedUser, onUserChange}) {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);

    useEffect(() => {
        let active = true;

        axios
            .get(route("dashboard.users.simpeg.search"), {
                params: { search: "" },
            })
            .then((response) => {
                if (!active) return;

                setUsers((response.data?.data ?? []).map((user) => ({
                    ...user,
                    id: String(user.id),
                    value: String(user.id),
                    label: `${user.name} (${user.username})`,
                })));
            })
            .finally(() => {
                if (active) setIsLoadingUsers(false);
            });

        return () => {
            active = false;
        };
    }, []);

    return (
        <div>
            <label className="form-label">{t("Search Employee")}</label>
            <Select
                options={users}
                isLoading={isLoadingUsers}
                isClearable
                isOptionDisabled={(option) => option.exists}
                getOptionValue={(option) => String(option.id)}
                getOptionLabel={(option) => option.label}
                value={selectedUser}
                onChange={(option) => onUserChange(option)}
                placeholder={t("Type employee name")}
                noOptionsMessage={() => t("No users found")}
            />

            {errors.simpeg_user_id && (
                <div className="text-danger small mt-2">
                    {errors.simpeg_user_id}
                </div>
            )}

            {selectedUser && (
                <div className="alert alert-light border mt-3 mb-0">
                    <div><strong>{selectedUser.name}</strong></div>
                    <div className="text-muted">{selectedUser.username}</div>
                    <div className="text-muted">{selectedUser.email || "-"}</div>
                </div>
            )}
        </div>
    );
}
