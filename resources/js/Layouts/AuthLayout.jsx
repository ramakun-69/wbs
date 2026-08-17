import { useTranslation } from "react-i18next";
import LogoBox from "../Components/templates/dashboard/partials/LogoBox";
import { ShieldCheck } from "lucide-react";

export default function AuthLayout({ children }) {
    const { t } = useTranslation();
    return (
        <main className="auth-bg auth-page d-flex align-items-center py-3">
            <div className="container-fluid px-3 px-lg-5">
                <div className="row g-0 auth-shell mx-auto">
                    <div className="col-lg-6 d-none d-lg-flex auth-aside">
                        <div className="auth-information w-100 h-100 d-flex flex-column justify-content-between">
                            <div>
                                <span className="auth-mark">Whistleblowing System </span>
                                <p className="text-uppercase fw-semibold small mt-5 mb-2">
                                    {/* Whistleblowing System */}
                                </p>
                                <h1 className="display-5 fw-bold mb-3">
                                    {t("Report Securely")}
                                </h1>
                                <p className="lead mb-0">
                                    {t(
                                        "Submit your report responsibly using a secure and trusted system.",
                                    )}
                                </p>
                            </div>
                            <div className="auth-information-note">
                                <ShieldCheck size={22} />
                                <span>
                                    {t(
                                        "Report data is protected and accessible only to authorized parties.",
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="text-center mb-4 auth-brand justify-content-center d-lg-none">
                            <LogoBox />
                        </div>
                        <div className="card border-0 shadow-lg auth-card">
                            <div className="card-body p-4 p-md-5">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
