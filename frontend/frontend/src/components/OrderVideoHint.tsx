import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPlayCircle } from "react-icons/fa";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
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

export default function OrderVideoHint() {
    const { t, i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(
        VIDEOS[i18n.language] ? i18n.language : "de"
    );

    return (
        <div className="order-video-hint">
            <button
                className="order-video-hint__toggle"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
            >
                <FaPlayCircle className="order-video-hint__play-icon" />
                <span>{t('orderVideoHintLabel')}</span>
                {open ? (
                    <IoChevronUp className="order-video-hint__chevron" />
                ) : (
                    <IoChevronDown className="order-video-hint__chevron" />
                )}
            </button>

            <div className={`order-video-hint__panel${open ? " order-video-hint__panel--open" : ""}`}>
                <div className="hiw-video__tabs" style={{ marginBottom: "1rem" }}>
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

                <div className="order-video-hint__frame-wrap">
                    <iframe
                        key={selected}
                        src={`https://www.youtube-nocookie.com/embed/${VIDEOS[selected]}?rel=0`}
                        title={`Bestellvorgang (${selected.toUpperCase()})`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                        className="hiw-video__frame"
                    />
                </div>
            </div>
        </div>
    );
}
