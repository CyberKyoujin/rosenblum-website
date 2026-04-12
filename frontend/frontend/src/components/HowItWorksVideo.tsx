import { useState } from "react";
import { useTranslation } from "react-i18next";
import deFlag from "../assets/de.svg";
import ruFlag from "../assets/ru.svg";
import uaFlag from "../assets/ua.svg";

const VIDEOS: Record<string, string> = {
    de: "W2-SC-YXvpU",
    ru: "4SL1LU5EBQA",
    ua: "DbnxuZWJfDc",
};

const LANGS = [
    { code: "de", flag: deFlag, label: "DE" },
    { code: "ru", flag: ruFlag, label: "RU" },
    { code: "ua", flag: uaFlag, label: "UA" },
];

export default function HowItWorksVideo() {
    const { t, i18n } = useTranslation();
    const initial = VIDEOS[i18n.language] ? i18n.language : "de";
    const [selected, setSelected] = useState(initial);

    return (
        <div className="hiw-video">
            <div className="how-it-works__header">
                <h1>{t('thisWay')}</h1>
                <h1 className="header-span">{t('itWorks')}</h1>
            </div>

            <div className="hiw-video__tabs">
                {LANGS.map(({ code, flag, label }) => (
                    <button
                        key={code}
                        className={`hiw-video__tab${selected === code ? " hiw-video__tab--active" : ""}`}
                        onClick={() => setSelected(code)}
                    >
                        <img src={flag} alt={label} className="hiw-video__flag" />
                        {label}
                    </button>
                ))}
            </div>

            <div className="hiw-video__frame-wrap">
                <iframe
                    key={selected}
                    src={`https://www.youtube-nocookie.com/embed/${VIDEOS[selected]}?rel=0`}
                    title={`How it works (${selected.toUpperCase()})`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    className="hiw-video__frame"
                />
            </div>
        </div>
    );
}
