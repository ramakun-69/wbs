import { Link, useForm, usePage } from "@inertiajs/react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import AuthLayout from "../../Layouts/AuthLayout";
import "../../../css/auth/login.css";
import { useTranslation } from 'react-i18next';
import TextInput from "../../Components/ui/TextInput"
import Button from "../../Components/ui/Button";
import { Icon as Iconify} from '@iconify/react';
import { notifyError, notifySuccess } from "../../Components/ui/Toastify";


export default function Login() {
    const [loginType, setLoginType] = useState("individual");
    const [showPassword, setShowPassword] = useState(false);
    const {data, setData, errors, clearErrors, processing, post} = useForm({
         email: "",
         password: ""
    });
    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    };
    const loginWithSso = () => { window.location.href = "/auth/sso/redirect"; };
    const { t } = useTranslation();
    const { flash } = usePage().props;
    const handleSubmit = async (e) => {
        e.preventDefault();
        clearErrors();
        post(route("authenticate"));
    };

      useEffect(() => {
          if (flash.error) {
              notifyError(flash.error, "bottom-center");
          } else if (flash.success) {
              notifySuccess(flash.success, "bottom-center");
          }
      }, [flash.error, flash.success]);

    return (
        <AuthLayout>
            <div className="text-center mb-4">
                <span className="auth-mark auth-mark-mobile">
                    Whistleblowing System
                </span>
                <h2 className="fw-semibold mt-3 mb-2">{t("Welcome")}</h2>
                <p className="text-muted mb-0">
                    {t("Please select your login method.")}
                </p>
            </div>

            <div className="login-type-selector mb-4" role="tablist">
                <Button
                    type="button"
                    className={loginType === "individual" ? "active" : ""}
                    onClick={() => setLoginType("individual")}
                >
                    {t("Reporter")}
                </Button>
                <Button
                    type="button"
                    className={loginType === "internal" ? "active" : ""}
                    onClick={() => setLoginType("internal")}
                >
                    {t("Internal")}
                </Button>
            </div>

            {loginType === "internal" ? (
                <div className="sso-login-panel text-center">
                    <div className="sso-icon">
                        <ShieldCheck size={28} />
                    </div>
                    <h5 className="fw-semibold mt-3">{t("Internal Login")}</h5>
                    <p className="text-muted small mb-4">
                        {t(
                            "Internal employees log in using their SIMPEG accounts.",
                        )}
                    </p>
                    <Button
                        type="button"
                        className="btn btn-primary w-100 py-2"
                        onClick={loginWithSso}
                    >
                        {t("Log in using SIMPEG SSO.")}{" "}
                        <ArrowRight size={18} className="ms-2" />
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email" className="form-label">
                        {t("Email")}
                    </label>
                    <div className="input-group-lg mb-2">
                        <TextInput
                            id="email"
                            type="email"
                            className="form-control"
                            value={data.email}
                            placeholder={t("Enter Attribute", {
                                attribute: t("Email"),
                            })}
                            errorMessage={errors.email}
                            onChange={(e) => {
                                clearErrors("email");
                                setData("email", e.target.value);
                            }}
                        />
                    </div>
                    <label htmlFor="password" className="form-label">
                        {t("Password")}
                    </label>
                    <div className="password-field mb-4">
                        <TextInput
                            type={showPassword ? "text" : "password"}
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className="form-control-lg bg-neutral-50 radius-12 pe-5"
                            id="password"
                            placeholder={t("Enter Attribute", {
                                attribute: t("Password"),
                            })}
                            autoComplete="current-password"
                            errorMessage={errors.password}
                        />
                        <Button
                            type="button"
                            className="password-toggle"
                            onClick={togglePassword}
                            aria-label={
                                showPassword
                                    ? "Sembunyikan kata sandi"
                                    : "Tampilkan kata sandi"
                            }
                        >
                            <Iconify
                                icon={
                                    showPassword
                                        ? "ri:eye-off-line"
                                        : "ri:eye-line"
                                }
                                width="20"
                            />
                        </Button>
                    </div>
                    <Button
                        type="submit"
                        className="btn btn-primary btn-lg w-100"
                        disabled={processing}
                    >
                        {t("Login")}
                    </Button>
                    <div className="text-center mt-4">
                        <span className="text-muted small mx-1">
                            {t("Don't have an account yet?")}
                        </span>
                        <Link href={route("register.index")} className="small">
                            {t("Register An Account")}
                        </Link>
                    </div>
                </form>
            )}
        </AuthLayout>
    );
}
