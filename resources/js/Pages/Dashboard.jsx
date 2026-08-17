import { usePage } from "@inertiajs/react";

export default function Dashboard() {
    const { auth } = usePage().props;

    return (
        <main className="min-vh-100 bg-light p-4 p-lg-5">
            <div className="container">
                <div className="card border-0 shadow-sm">
                    <div className="card-body p-4 p-lg-5">
                        <p className="text-uppercase text-primary fw-semibold small mb-2">WBS</p>
                        <h1 className="h3 mb-2">Selamat datang, {auth.user?.name}</h1>
                        <p className="text-muted mb-0">Anda berhasil masuk ke Whistleblowing System.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
