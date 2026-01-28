import { useTranslation } from "react-i18next";
import {
    IoDocumentTextOutline,
    IoHeartOutline,
    IoSchoolOutline,
    IoAddCircle,
    IoRemoveCircle
} from "react-icons/io5";
import { FaEquals } from "react-icons/fa6";

interface PriceItem {
    labelKey: string;
    price: string;
}

interface PricingExample {
    icon: React.ReactNode;
    documentKey: string;
    items: PriceItem[];
    total: string | null;
    isIndividual?: boolean;
}

const PricingExamples = () => {
    const { t } = useTranslation();

    const examples: PricingExample[] = [
        {
            icon: <IoDocumentTextOutline />,
            documentKey: "pricing_examples.birth_cert",
            items: [
                { labelKey: "pricing_examples.birth_cert", price: "35,30€" },
                { labelKey: "pricing_examples.apostille_trans", price: "10,50€" }
            ],
            total: "45,80€"
        },
        {
            icon: <IoHeartOutline />,
            documentKey: "pricing_examples.marriage_cert",
            items: [
                { labelKey: "pricing_examples.marriage_cert", price: "35,30€" },
                { labelKey: "pricing_examples.apostille_trans", price: "10,50€" },
                { labelKey: "pricing_examples.apostille_cert", price: "25,00€" }
            ],
            total: "70,80€"
        },
        {
            icon: <IoSchoolOutline />,
            documentKey: "pricing_examples.complex_docs",
            items: [
                { labelKey: "pricing_examples.complex_docs", price: "" }
            ],
            total: null,
            isIndividual: true
        }
    ];

    return (
        <section className="pe">
            <div className="pe__header">
                <h2 className="pe__title">
                    {t("pricing_examples.title")}
                </h2>
                <p className="pe__subtitle">{t("pricing_examples.subtitle")}</p>
            </div>

            <div className="pe__examples">
                {examples.map((example, index) => (
                    <div
                        key={index}
                        className={`pe__card ${example.isIndividual ? 'pe__card--individual' : ''}`}
                    >
                        {/* Document image/icon area */}
                        <div className="pe__card-image">
                            <div className="pe__card-image-overlay"></div>
                            <div className="pe__card-icon">
                                {example.icon}
                            </div>
                        </div>

                        {/* Formula area */}
                        <div className="pe__formula">
                            {example.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="pe__formula-row">
                                    {itemIndex > 0 && (
                                        <div className="pe__formula-operator">
                                            <IoAddCircle />
                                        </div>
                                    )}
                                    <div className="pe__formula-item">
                                        <span className="pe__formula-label">{t(item.labelKey)}</span>
                                        {!example.isIndividual && (
                                            <span className="pe__formula-price">{item.price}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Result area */}
                        <div className="pe__result">
                            {example.isIndividual ? (
                                <div className="pe__result-individual">
                                    <IoRemoveCircle className="pe__result-icon" />
                                    <span className="pe__result-individual-text">
                                        {t("pricing_examples.individual")}
                                    </span>
                                </div>
                            ) : (
                                <>
                                    <div className="pe__result-equals">
                                        <FaEquals />
                                    </div>
                                    <div className="pe__result-total">
                                        <span className="pe__result-label">{t("pricing_examples.total")}</span>
                                        <span className="pe__result-price">{example.total}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PricingExamples;
