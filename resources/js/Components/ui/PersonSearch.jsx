import { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

import Button from "../ui/Button";
import TextInput from "../ui/TextInput";

export default function PeopleSearch({ person, onSelect, onCancel }) {
    const { t } = useTranslation();

    const [nik, setNik] = useState("");
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState(null);

    const search = async () => {
        setProcessing(true);
        setErrors({});
        setResult(null);

        try {
            const response = await axios.get(route("dashboard.people.search"), {
                params: {
                    nik,
                },
            });

            setResult(response.data);
        } catch (error) {
            setErrors(error.response.data.errors);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <div className="row mb-3">
                <div className="col-md-10">
                    <TextInput
                        value={nik}
                        readOnly={processing || person?.id}
                        onChange={(e) => {
                            const value = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 16);
                            setNik(value);
                            setErrors({});
                            setResult(null);
                        }}
                        errorMessage={errors.nik?.[0]}
                        placeholder={t("Enter Attribute", {
                            attribute: t("National Identification Number"),
                        })}
                    />
                </div>
                <div className="col-md-2">
                    {person?.id ? (
                        <>
                            <Button
                                className="btn btn-danger w-100"
                                onClick={() => {
                                    setNik("");
                                    onCancel();
                                }}
                            >
                                {t("Cancel")}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                className="btn btn-mint w-100"
                                disabled={
                                    processing || person?.id || nik.length < 16
                                }
                                onClick={search}
                            >
                                {processing ? t("Searching...") : t("Search")}
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {result && (
                <div className="card">
                    <div className="card-body">
                        <table className="table table-borderless mb-3">
                            <tbody>
                                <tr>
                                    <th width="180">{t("NIK")}</th>
                                    <td>{result.nik}</td>
                                </tr>

                                <tr>
                                    <th>{t("Name")}</th>
                                    <td>{result.name}</td>
                                </tr>

                                <tr>
                                    <th>{t("Gender")}</th>
                                    <td>{t(result.gender)}</td>
                                </tr>

                                <tr>
                                    <th>{t("Religion")}</th>
                                    <td>{t(result.religion)}</td>
                                </tr>

                                <tr>
                                    <th>{t("Phone")}</th>
                                    <td>{result.phone ?? "-"}</td>
                                </tr>

                                <tr>
                                    <th>{t("Address")}</th>
                                    <td>{result.address ?? "-"}</td>
                                </tr>
                            </tbody>
                        </table>
                        <Button
                            className="btn btn-success"
                            onClick={() => {
                                onSelect(result);
                                setResult(null);
                            }}
                        >
                            {t("Use Data")}
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
