import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { useTranslation } from "react-i18next";

export default function IndonesiaRegionSelect({
    provinceCode,
    cityCode,
    districtCode,
    villageCode,
    onProvinceChange,
    onCityChange,
    onDistrictChange,
    onVillageChange,
    errorPrefix = "",
    errors = {},
    clearErrors = () => {},
}) {
    const { t } = useTranslation();

    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [villages, setVillages] = useState([]);
    const getError = (field) =>
        errorPrefix ? errors[`${errorPrefix}.${field}`] : errors[field];
    useEffect(() => {
        loadProvinces();
    }, []);

    useEffect(() => {
        if (provinceCode) {
            loadCities(provinceCode);
        }
    }, [provinceCode]);

    useEffect(() => {
        if (cityCode) {
            loadDistricts(cityCode);
        }
    }, [cityCode]);

    useEffect(() => {
        if (districtCode) {
            loadVillages(districtCode);
        }
    }, [districtCode]);

    const loadProvinces = async () => {
        const response = await axios.get(route("regions.provinces"));

        setProvinces(response.data);
    };

    const loadCities = async (provinceCode) => {
        const response = await axios.get(route("regions.cities", provinceCode));

        setCities(response.data);
    };

    const loadDistricts = async (cityCode) => {
        const response = await axios.get(route("regions.districts", cityCode));

        setDistricts(response.data);
    };

    const loadVillages = async (districtCode) => {
        const response = await axios.get(
            route("regions.villages", districtCode),
        );

        setVillages(response.data);
    };

    return (
        <>
            {/* Province */}
            <div className="col-6 mt-3">
                <label className="form-label">{t("Province")}</label>
                <small className="text-danger">*</small>
                <Select
                    classNamePrefix="react-select"
                    className={`react-select-container ${getError("province_code") ? "is-invalid" : ""}`}
                    options={provinces}
                    getOptionLabel={(item) => item.name}
                    getOptionValue={(item) => item.code}
                    value={
                        provinces.find((item) => item.code === provinceCode) ||
                        null
                    }
                    onChange={(selected) => {
                        clearErrors("province_code");
                        onProvinceChange(selected?.code || null);

                        onCityChange(null);
                        onDistrictChange(null);
                        onVillageChange(null);

                        setCities([]);
                        setDistricts([]);
                        setVillages([]);

                        if (selected?.code) {
                            loadCities(selected.code);
                        }
                    }}
                    placeholder={t("Select Attribute", {
                        attribute: t("Province"),
                    })}
                    isClearable
                    isSearchable
                />

                {getError("province_code") && (
                    <small className="text-danger">
                        {getError("province_code")}
                    </small>
                )}
            </div>

            {/* City */}
            <div className="col-6 mt-3">
                <label className="form-label">{t("City")}</label>
                <small className="text-danger">*</small>
                <Select
                    classNamePrefix="react-select"
                    className={`react-select-container ${getError("city_code") ? "is-invalid" : ""}`}
                    options={cities}
                    getOptionLabel={(item) => item.name}
                    getOptionValue={(item) => item.code}
                    value={
                        cities.find((item) => item.code === cityCode) || null
                    }
                    onChange={(selected) => {
                        clearErrors("city_code");
                        onCityChange(selected?.code || null);

                        onDistrictChange(null);
                        onVillageChange(null);

                        setDistricts([]);
                        setVillages([]);

                        if (selected?.code) {
                            loadDistricts(selected.code);
                        }
                    }}
                    placeholder={t("Select Attribute", {
                        attribute: t("City"),
                    })}
                    isDisabled={!provinceCode}
                    isClearable
                    isSearchable
                />

                {getError("city_code") && (
                    <small className="text-danger">{getError("city_code")}</small>
                )}
            </div>

            {/* District */}
            <div className="col-6 mt-3">
                <label className="form-label">{t("District")}</label>
                <small className="text-danger">*</small>
                <Select
                    classNamePrefix="react-select"
                    className={`react-select-container ${getError("district_code") ? "is-invalid" : ""}`}
                    options={districts}
                    getOptionLabel={(item) => item.name}
                    getOptionValue={(item) => item.code}
                    value={
                        districts.find((item) => item.code === districtCode) ||
                        null
                    }
                    onChange={(selected) => {
                        clearErrors("district_code");
                        onDistrictChange(selected?.code || null);

                        onVillageChange(null);

                        setVillages([]);

                        if (selected?.code) {
                            loadVillages(selected.code);
                        }
                    }}
                    placeholder={t("Select Attribute", {
                        attribute: t("District"),
                    })}
                    isDisabled={!cityCode}
                    isClearable
                    isSearchable
                />

                {getError("district_code") && (
                    <small className="text-danger">
                        {getError("district_code")}
                    </small>
                )}
            </div>

            {/* Village */}
            <div className="col-6 mt-3">
                <label className="form-label">{t("Village")}</label>
                <small className="text-danger">*</small>
                <Select
                    classNamePrefix="react-select"
                    className={`react-select-container ${getError("village_code") ? "is-invalid" : ""}`}
                    options={villages}
                    getOptionLabel={(item) => item.name}
                    getOptionValue={(item) => item.code}
                    value={
                        villages.find((item) => item.code === villageCode) ||
                        null
                    }
                    onChange={(selected) => {
                        clearErrors("village_code");
                        onVillageChange(selected?.code || null);
                    }}
                    placeholder={t("Select Attribute", {
                        attribute: t("Village"),
                    })}
                    isDisabled={!districtCode}
                    isClearable
                    isSearchable
                />

                {getError("village_code") && (
                    <small className="text-danger">{getError("village_code")}</small>
                )}
            </div>
        </>
    );
}
