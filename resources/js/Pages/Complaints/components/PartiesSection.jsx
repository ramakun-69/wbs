import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import Button from "../../../Components/ui/Button";
import TextInput from "../../../Components/ui/TextInput";

const emptyParty = () => ({
    name: "",
    position: "",
    position_classification: "",
});

export { emptyParty };

export default function PartiesSection({ parties, setData, errors = {} }) {
    const { t } = useTranslation();

    const handleUpdateParty = (index, field, value) => {
        const nextParties = parties.map((party, partyIndex) =>
            partyIndex === index ? { ...party, [field]: value } : party
        );
        setData("parties", nextParties);
    };

    const handleAddParty = () => setData("parties", [...parties, emptyParty()]);

    const handleRemoveParty = (index) => {
        if (parties.length === 1) return;
        setData("parties", parties.filter((_, partyIndex) => partyIndex !== index));
    };

    return (
        <section className="complaint-form-section">
            <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
                <div>
                    <h5 className="mb-1">{t("Involved Parties")}</h5>
                    <p className="text-muted mb-0 small">
                        {t("Add the parties related to the reported incident.")}
                    </p>
                </div>
                <Button type="button" className="btn btn-sm btn-primary" onClick={handleAddParty}>
                    <Icon icon="line-md:plus" className="me-1" />
                    {t("Add")}
                </Button>
            </div>

            {parties.map((party, index) => (
                <div className="border rounded p-3 mb-3" key={`party-${index}`}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="fw-semibold">{t("Party {{number}}", { number: index + 1 })}</span>
                        <Button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleRemoveParty(index)}
                            disabled={parties.length === 1}
                            title={t("Remove")}
                        >
                            <Icon icon="solar:trash-bin-trash-outline" />
                        </Button>
                    </div>

                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">{t("Full Name")} *</label>
                            <TextInput
                                value={party.name}
                                errorMessage={errors[`parties.${index}.name`]}
                                onChange={(event) => handleUpdateParty(index, "name", event.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">{t("Position")}</label>
                            <TextInput
                                value={party.position}
                                onChange={(event) => handleUpdateParty(index, "position", event.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">{t("Position Classification")}</label>
                            <Select
                                options={[
                                    { value: "structural", label: t("Structural Official") },
                                    { value: "functional", label: t("Functional Official") },
                                    { value: "staff", label: t("Staff") },
                                    { value: "external", label: t("External Party") },
                                ]}
                                value={[
                                    { value: "structural", label: t("Structural Official") },
                                    { value: "functional", label: t("Functional Official") },
                                    { value: "staff", label: t("Staff") },
                                    { value: "external", label: t("External Party") },
                                ].find((option) => option.value === party.position_classification) ?? null}
                                onChange={(option) => handleUpdateParty(index, "position_classification", option?.value ?? "")}
                                placeholder={t("Select classification")}
                                isClearable
                                classNamePrefix="react-select"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
}
