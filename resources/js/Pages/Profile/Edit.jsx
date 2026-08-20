import { useForm } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../../Layouts/DashboardLayout";
import Breadcrumb from "../../Components/ui/Breadcrumb";
import Button from "../../Components/ui/Button";
import TextInput from "../../Components/ui/TextInput";
import { notifySuccess } from "../../Components/ui/Toastify";

export default function Edit({ user }) {
    const { t } = useTranslation();
    const { data, setData, put, processing, errors } = useForm(user);

    const handleSubmit = (event) => {
        event.preventDefault();
        put(route("dashboard.profile.update"), {
            preserveScroll: true,
            onSuccess: (page) =>
                notifySuccess(
                    page.props?.flash?.success ??
                        t("Profile updated successfully."),
                ),
        });
    };

    return (
        <DashboardLayout>
            <Breadcrumb title={t("Dashboard")} subtitle={t("Profile")} />
            <div className="card">
                <div className="card-header">
                    <h4 className="header-title mb-0">{t("Profile")}</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">
                                    {t("Full Name")}
                                </label>
                                <TextInput
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    errorMessage={errors.name}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">
                                    {t("Username")}
                                </label>
                                <TextInput
                                    value={data.username}
                                    onChange={(e) =>
                                        setData("username", e.target.value)
                                    }
                                    errorMessage={errors.username}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">
                                    {t("Email")}
                                </label>
                                <TextInput
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    errorMessage={errors.email}
                                />
                            </div>
                        </div>
                        <div className="d-flex justify-content-end mt-3">
                            <Button
                                type="submit"
                                className="btn btn-primary"
                                isLoading={processing}
                            >
                                {t("Save")}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
