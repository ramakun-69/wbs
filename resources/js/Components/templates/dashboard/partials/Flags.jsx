import { useEffect, useState } from "react";
import axios from "axios";
import { route } from "ziggy-js";
import i18n from "../../../../i18n";
import flagUs from "@/assets/dashboard/images/flags/us.svg";
import flagId from "@/assets/dashboard/images/flags/id.svg";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "react-bootstrap";

const countryData = [
    { locale: "en", image: flagUs, language: "English" },
    { locale: "id", image: flagId, language: "Indonesia" },
];

export default function Flags() {
    const [currentLang, setCurrentLang] = useState(i18n.resolvedLanguage || "en");

    useEffect(() => {
        const handleLanguageChanged = (language) => setCurrentLang(language);
        i18n.on("languageChanged", handleLanguageChanged);
        return () => i18n.off("languageChanged", handleLanguageChanged);
    }, []);

    const selectedCountry = countryData.find((item) => item.locale === currentLang) || countryData[0];

    const handleChangeLanguage = async (locale) => {
        setCurrentLang(locale);
        await i18n.changeLanguage(locale);

        try {
            await axios.post(route("set-language"), { locale });
        } catch (error) {
            console.error("Gagal menyimpan bahasa:", error);
        }
    };

  return <div className="topbar-item">
      <Dropdown className="" align={'end'}>
        <DropdownToggle as={'button'} className="topbar-link drop-arrow-none" data-bs-toggle="dropdown" data-bs-offset="0,25" data-bs-auto-close="outside" aria-haspopup="false" aria-expanded="false">
          <img src={selectedCountry.image} alt={selectedCountry.language} className="rounded" height={18} id="selected-language-image" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-start">
          {countryData.map((item) => <DropdownItem key={item.locale} onClick={() => handleChangeLanguage(item.locale)}>
              <img src={item.image} alt="user-image" className="me-1 rounded" height={18} data-translator-image />
              <span className="align-middle">{item.language}</span>
            </DropdownItem>)}
        </DropdownMenu>
      </Dropdown>
    </div>;
}
