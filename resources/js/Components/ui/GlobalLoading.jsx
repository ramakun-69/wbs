import { useLoading } from "../../Services/LoadingService";


export default function GlobalLoading() {
    const loading = useLoading();

    if (!loading) return null;

    return (
        <div className="global-loading">
            {/* <div className="spinner-border text-mint" /> */}
        </div>
    );
}
