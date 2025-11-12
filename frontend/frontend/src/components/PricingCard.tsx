import { useTranslation } from "react-i18next";
import { HiBadgeCheck } from "react-icons/hi";
import { Link } from "react-router-dom";

const PricingCard: React.FC<PricingCardProps> = ({title, price, priceDescription, description, features, showVat=false, highlighted=false, linkText}) => {

    const { t } = useTranslation();

    return (
        <section className={`pricing-item ${highlighted ? "pricing-item-blue" : ""}`}>

            <header className="pricing-card-header">
                {title ? (
                    <h2>{title}</h2>
                ): (
                    <>
                        <h2>{price}</h2>
                        <p className="tax">inkl. MwSt.</p>
                        <p>{`/ ${priceDescription}`}</p>
                    </>
                )}
            </header>

            <div className="pricing-card-description">
                <p>{description}</p>
            </div>

            <div className="pricing-card-bottom">
                <div className="pricing-card-list">
                    {features?.map((key) => (
                        <p>
                            <HiBadgeCheck className="check-icon"></HiBadgeCheck>
                            <p>{key}</p>
                        </p>
                    ))}
                </div>
            </div>
            
            <Link className="offer-btn hover-btn" to="/order">{linkText}</Link>

        </section>
    )
}

export default PricingCard;