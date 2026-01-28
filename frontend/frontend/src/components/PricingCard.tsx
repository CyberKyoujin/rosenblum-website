import { IoCheckmarkCircle } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PricingCard: React.FC<PricingCardProps> = ({
    title,
    price,
    priceDescription,
    description,
    features,
    highlighted = false,
    linkText
}) => {
    const { t } = useTranslation();

    return (
        <div className={`pc ${highlighted ? "pc--highlighted" : ""}`}>
            <div className="pc__header">
                {title ? (
                    <span className="pc__title">{title}</span>
                ) : (
                    <div className="pc__price-block">
                        <span className="pc__price">{price}</span>
                        <div className="pc__price-meta">
                            <span className="pc__price-desc">/ {priceDescription}</span>
                            <span className="pc__vat">{t("documents_price.vatIncluded")}</span>
                        </div>
                    </div>
                )}
            </div>

            <p className="pc__description">{description}</p>

            <ul className="pc__features">
                {features?.map((feature, idx) => (
                    <li key={idx} className="pc__feature">
                        <IoCheckmarkCircle className="pc__feature-icon" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            <Link className="pc__btn" to="/order">
                {linkText}
            </Link>
        </div>
    );
};

export default PricingCard;
