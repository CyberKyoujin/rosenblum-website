import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoDocumentTextOutline, IoShieldCheckmarkOutline, IoRibbonOutline, IoCreateOutline } from "react-icons/io5";
import { HiOutlineIdentification } from "react-icons/hi2";

interface AnatomyElement {
    id: string;
    icon: React.ReactNode;
    titleKey: string;
    descKey: string;
}

const TranslationAnatomy = () => {
    const { t } = useTranslation();
    const [hoveredElement, setHoveredElement] = useState<string | null>(null);

    const anatomyElements: AnatomyElement[] = [
        {
            id: "header",
            icon: <HiOutlineIdentification />,
            titleKey: "translation_sample.header",
            descKey: "translation_sample.headerDesc"
        },
        {
            id: "content",
            icon: <IoDocumentTextOutline />,
            titleKey: "translation_sample.content",
            descKey: "translation_sample.contentDesc"
        },
        {
            id: "certification",
            icon: <IoShieldCheckmarkOutline />,
            titleKey: "translation_sample.certification",
            descKey: "translation_sample.certificationDesc"
        },
        {
            id: "stamp",
            icon: <IoRibbonOutline />,
            titleKey: "translation_sample.stamp",
            descKey: "translation_sample.stampDesc"
        },
        {
            id: "signature",
            icon: <IoCreateOutline />,
            titleKey: "translation_sample.signature",
            descKey: "translation_sample.signatureDesc"
        }
    ];

    return (
        <section className="ta">
            <div className="ta__header">
                <h2 className="ta__title">
                    {t("translation_sample.title")}{" "}
                    <span className="header-span">{t("translation_sample.titleHighlight")}</span>
                </h2>
                <p className="ta__subtitle">{t("translation_sample.subtitle")}</p>
            </div>

            <div className="ta__content">
                <div className="ta__document">
                    <div className="ta__paper">
                        <div
                            className={`ta__zone ta__zone--header ${hoveredElement === "header" ? "ta__zone--active" : ""}`}
                            onMouseEnter={() => setHoveredElement("header")}
                            onMouseLeave={() => setHoveredElement(null)}
                        >
                            <div className="ta__zone-label">1</div>
                            <div className="ta__placeholder ta__placeholder--header"></div>
                            <div className="ta__placeholder ta__placeholder--subheader"></div>
                        </div>

                        <div
                            className={`ta__zone ta__zone--content ${hoveredElement === "content" ? "ta__zone--active" : ""}`}
                            onMouseEnter={() => setHoveredElement("content")}
                            onMouseLeave={() => setHoveredElement(null)}
                        >
                            <div className="ta__zone-label">2</div>
                            <div className="ta__placeholder ta__placeholder--text"></div>
                            <div className="ta__placeholder ta__placeholder--text"></div>
                            <div className="ta__placeholder ta__placeholder--text ta__placeholder--short"></div>
                            <div className="ta__placeholder ta__placeholder--text"></div>
                            <div className="ta__placeholder ta__placeholder--text ta__placeholder--medium"></div>
                        </div>

                        <div
                            className={`ta__zone ta__zone--certification ${hoveredElement === "certification" ? "ta__zone--active" : ""}`}
                            onMouseEnter={() => setHoveredElement("certification")}
                            onMouseLeave={() => setHoveredElement(null)}
                        >
                            <div className="ta__zone-label">3</div>
                            <div className="ta__placeholder ta__placeholder--cert"></div>
                            <div className="ta__placeholder ta__placeholder--cert ta__placeholder--short"></div>
                        </div>

                        <div className="ta__footer-area">
                            <div
                                className={`ta__zone ta__zone--stamp ${hoveredElement === "stamp" ? "ta__zone--active" : ""}`}
                                onMouseEnter={() => setHoveredElement("stamp")}
                                onMouseLeave={() => setHoveredElement(null)}
                            >
                                <div className="ta__zone-label">4</div>
                                <div className="ta__stamp-placeholder"></div>
                            </div>

                            <div
                                className={`ta__zone ta__zone--signature ${hoveredElement === "signature" ? "ta__zone--active" : ""}`}
                                onMouseEnter={() => setHoveredElement("signature")}
                                onMouseLeave={() => setHoveredElement(null)}
                            >
                                <div className="ta__zone-label">5</div>
                                <div className="ta__signature-placeholder"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="ta__list">
                    {anatomyElements.map((element, index) => (
                        <div
                            key={element.id}
                            className={`ta__item ${hoveredElement === element.id ? "ta__item--active" : ""}`}
                            onMouseEnter={() => setHoveredElement(element.id)}
                            onMouseLeave={() => setHoveredElement(null)}
                        >
                            <div className="ta__item-number">{index + 1}</div>
                            <div className="ta__item-icon">{element.icon}</div>
                            <div className="ta__item-content">
                                <h3 className="ta__item-title">{t(element.titleKey)}</h3>
                                <p className="ta__item-desc">{t(element.descKey)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <p className="ta__privacy">{t("translation_sample.privacy")}</p>
        </section>
    );
};

export default TranslationAnatomy;
