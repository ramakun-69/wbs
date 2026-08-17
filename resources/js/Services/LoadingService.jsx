import { useSyncExternalStore } from "react";

let loading = false;

const listeners = new Set();

function emit() {
    listeners.forEach((listener) => listener());
}

export function showLoading() {
    loading = true;
    emit();
}

export function hideLoading() {
    loading = false;
    emit();
}

export function useLoading() {
    return useSyncExternalStore(
        (listener) => {
            listeners.add(listener);

            return () => listeners.delete(listener);
        },
        () => loading,
    );
}
