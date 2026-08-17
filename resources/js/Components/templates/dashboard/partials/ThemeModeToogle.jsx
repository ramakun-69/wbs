import { Moon, Sun } from "lucide-react";
import Button from "../../../ui/Button";
import { useEffect, useState } from "react";

export default function ThemeModeToggle() {
    const [dark, setDark] = useState(false);
    const toggleTheme = () => {
        const next = !dark;
        setDark(next);
        localStorage.setItem("wbs-theme", next ? "dark" : "light");
        document.documentElement.setAttribute("data-bs-theme",next ? "dark" : "light");
    };
      useEffect(() => {
            const saved = localStorage.getItem("wbs-theme") === "dark";
            setDark(saved);
            document.documentElement.setAttribute(
                "data-bs-theme",
                saved ? "dark" : "light",
            );
        }, []);
    return (
        <Button
            type="button"
            onClick={toggleTheme}
            className="topbar-link border-0 bg-transparent"
            aria-label="Toggle theme"
        >
            {dark ? (
                <Sun className="text-white fs-22" />
            ) : (
                <Moon className="text-white fs-22" />
            )}
        </Button>
    );
}
