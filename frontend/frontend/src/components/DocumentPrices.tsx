import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
    IoDocumentTextOutline,
    IoSchoolOutline,
    IoCarOutline,
    IoHomeOutline,
    IoRibbonOutline,
    IoDocumentsOutline,
    IoHelpCircleOutline
} from "react-icons/io5";

interface DocumentPriceItem {
    icon: React.ReactNode;
    labelKey: string;
    price: string;
    isIndividual?: boolean;
    description?: string;
}

const DocumentPrices = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const documents: DocumentPriceItem[] = [
        {
            icon: <IoDocumentTextOutline />,
            labelKey: "documents_price.certificates",
            price: "35,30€"
        },
        {
            icon: <IoSchoolOutline />,
            labelKey: "documents_price.schoolCertificates",
            price: "70,60€"
        },
        {
            icon: <IoCarOutline />,
            labelKey: "documents_price.driverLicense",
            price: "30,30€"
        },
        {
            icon: <IoHomeOutline />,
            labelKey: "documents_price.registrationCerts",
            price: "35,30€"
        },
        {
            icon: <IoRibbonOutline />,
            labelKey: "documents_price.apostille",
            price: "10,50€"
        },
        {
            icon: <IoDocumentsOutline />,
            labelKey: "documents_price.otherCerts",
            price: "35,30€"
        },
        {
            icon: <IoHelpCircleOutline />,
            labelKey: "documents_price.otherDocs",
            price: "",
            isIndividual: true,
            description: "documents_price.otherDocsDescription"
        }
    ];

    return (
        <section className="doc-prices">
            <div className="doc-prices__header">
                <h2 className="doc-prices__title">
                    {t("documents_price.title")}{" "}
                    <span className="header-span">{t("documents_price.titleHighlight")}</span>
                </h2>
                <p className="doc-prices__subtitle">{t("documents_price.subtitle")}</p>
            </div>

            <div className="doc-prices__grid">
                {documents.map((doc, index) => (
                    <div
                        key={index}
                        className={`doc-prices__item ${doc.isIndividual ? 'doc-prices__item--individual' : ''}`}
                    >
                        <div className="doc-prices__icon">
                            {doc.icon}
                        </div>
                        <div className="doc-prices__content">
                            <span className="doc-prices__label">{t(doc.labelKey)}</span>
                            {doc.description && (
                                <span className="doc-prices__description">{t(doc.description)}</span>
                            )}
                        </div>
                        <div className="doc-prices__price-wrapper">
                            {doc.isIndividual ? (
                                <>
                                    <span className="doc-prices__individual">{t("documents_price.individualCalc")}</span>
                                    <button
                                        className="doc-prices__quote-btn"
                                        onClick={() => navigate('/order')}
                                    >
                                        {t("documents_price.requestQuote")}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span className="doc-prices__price">{doc.price}</span>
                                    <span className="doc-prices__vat">{t("documents_price.vatIncluded")}</span>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default DocumentPrices;
