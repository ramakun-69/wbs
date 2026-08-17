import { Link, useForm } from "@inertiajs/react";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import AuthLayout from "../../Layouts/AuthLayout";
import TextInput from "../../Components/ui/TextInput";
import Button from "../../Components/ui/Button";
import "../../../css/auth/login.css";
import { useTranslation } from "react-i18next";

export default function Register() {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("register.store"), {
            onSuccess: (page) => {
                const error = page.props?.flash?.error;
                const success = page.props?.flash?.success;
                reset();
                handleCloseModal();
                if (error) notifyError(error, "bottom-center");
                notifySuccess(success, "bottom-center");
            },
        });
    };

    const passwordField = (id, label, value, visible, setVisible, error) => (
        <div className="mb-3">
            <label htmlFor={id} className="form-label">
                {label}
            </label>
            <div className="password-field">
                <TextInput
                    id={id}
                    type={visible ? "text" : "password"}
                    className="form-control-lg bg-neutral-50 radius-12"
                    value={value}
                    onChange={(event) => {
                        clearErrors(id);
                        setData(id, event.target.value);
                    }}
                    placeholder={t("Enter Attribute", {attribute : label})}
                    errorMessage={error}
                    autoComplete="new-password"
                />
                <Button
                    type="button"
                    className="password-toggle"
                    onClick={() => setVisible((current) => !current)}
                    aria-label={
                        visible
                            ? "Sembunyikan kata sandi"
                            : "Tampilkan kata sandi"
                    }
                >
                    {visible ? <EyeOff size={20} /> : <Eye size={20} />}
                </Button>
            </div>
        </div>
    );

    return (
        <AuthLayout>
            <div className="text-center mb-4">
                <span className="auth-mark auth-mark-mobile">
                    Whistleblowing System{" "}
                </span>
                <h2 className="fw-semibold mt-3 mb-2">
                    {t("Reporter Account Register")}
                </h2>
                <p className="text-muted mb-0">
                    {t("Create an account to submit a report.")}
                </p>
            </div>

            <div className="mb-3">
                <label htmlFor="email" className="form-label">
                    {t("Email")} <span className="text-muted"></span>
                </label>
                <TextInput
                    id="email"
                    type="email"
                    className="form-control-lg bg-neutral-50 radius-12"
                    value={data.email}
                    onChange={(event) => {
                        clearErrors("email");
                        setData("email", event.target.value);
                    }}
                    placeholder={t("Enter Attribute", {attribute: t("Email")})}
                    errorMessage={errors.email}
                    autoComplete="email"
                />
            </div>

            {passwordField(
                "password",
                t("Password"),
                data.password,
                showPassword,
                setShowPassword,
                errors.password,
            )}
            {passwordField(
                "password_confirmation",
                t("Confirm Password"),
                data.password_confirmation,
                showConfirmation,
                setShowConfirmation,
                errors.password_confirmation,
            )}

            <Button
                type="button"
                onClick={handleSubmit}
                className="btn btn-primary btn-lg w-100"
                isLoading={processing}
            >
                {t("Register")}
            </Button>

            <p className="text-center mt-4 mb-0 small text-muted">
                {t("Already have an account?")}{" "}
                <Link href="/login">{t("Login")}</Link>
            </p>
        </AuthLayout>
    );
}
