import AsyncSelect from "react-select/async";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function Form({
    data,
    setData,
    errors,
    selectedUser,
    onUserChange,
}) {
    const { t } = useTranslation();

    const loadUsers = async (inputValue) => {
        if (inputValue.trim().length < 2) return [];

        const response = await axios.get(route("users.simpeg.search"), {
            params: { search: inputValue },
        });

        return (response.data?.data ?? []).map((user) => ({
            value: user.id,
            label: `${user.name} (${user.username})`,
            ...user,
        }));
    };

    return (
        <div>
            <label className="form-label">{t("Search SIMPEG User")}</label>
            <AsyncSelect
                cacheOptions
                defaultOptions={false}
                isClearable
                isOptionDisabled={(option) => option.exists}
                loadOptions={loadUsers}
                value={selectedUser}
                onChange={onUserChange}
                placeholder={t("Type name or username...")}
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
