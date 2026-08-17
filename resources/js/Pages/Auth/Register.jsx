import { Link, useForm } from "@inertiajs/react";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import AuthLayout from "../../Layouts/AuthLayout";
import TextInput from "../../Components/ui/TextInput";
import Button from "../../Components/ui/Button";
import "../../../css/auth/login.css";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        name: "",
        nik: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (event) => {
        event.preventDefault();
        post("/register");
    };

    const passwordField = (id, label, value, visible, setVisible, error) => (
        <div className="mb-3">
            <label htmlFor={id} className="form-label">{label}</label>
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
                    errorMessage={error}
                    autoComplete="new-password"
                />
                <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setVisible((current) => !current)}
                    aria-label={visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                    {visible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
        </div>
    );

    return (
        <AuthLayout>
            <div className="text-center mb-4">
                <span className="auth-mark auth-mark-mobile">WBS</span>
                <h2 className="fw-semibold mt-3 mb-2">Registrasi Pelapor</h2>
                <p className="text-muted mb-0">Buat akun untuk menyampaikan laporan.</p>
            </div>

            <form onSubmit={submit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nama lengkap</label>
                    <TextInput
                        id="name"
                        className="form-control-lg bg-neutral-50 radius-12"
                        value={data.name}
                        onChange={(event) => {
                            clearErrors("name");
                            setData("name", event.target.value);
                        }}
                        errorMessage={errors.name}
                        autoComplete="name"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="nik" className="form-label">NIK</label>
                    <TextInput
                        id="nik"
                        inputMode="numeric"
                        className="form-control-lg bg-neutral-50 radius-12"
                        value={data.nik}
                        onChange={(event) => {
                            clearErrors("nik");
                            setData("nik", event.target.value.replace(/\D/g, "").slice(0, 16));
                        }}
                        errorMessage={errors.nik}
                        autoComplete="off"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email <span className="text-muted">(opsional)</span>
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
                        errorMessage={errors.email}
                        autoComplete="email"
                    />
                </div>

                {passwordField("password", "Kata sandi", data.password, showPassword, setShowPassword, errors.password)}
                {passwordField("password_confirmation", "Konfirmasi kata sandi", data.password_confirmation, showConfirmation, setShowConfirmation, errors.password_confirmation)}

                <Button type="submit" className="btn btn-primary btn-lg w-100" isLoading={processing}>
                    Daftar
                </Button>

                <p className="text-center mt-4 mb-0 small text-muted">
                    Sudah memiliki akun? <Link href="/login">Masuk</Link>
                </p>
            </form>
        </AuthLayout>
    );
}
