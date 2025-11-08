import { HiBadgeCheck } from "react-icons/hi";
import Divider from '@mui/material/Divider';
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import ContactSection from "../components/ContactSection";
import Section from "../components/Section"
import pricing_first from "../assets/pricing_first.jpg"
import React from "react";


interface PricingCardProps {
    title?: string;
    price?: string;
    priceDescription?: string;
    description?: string;
    features?: string[];
    showVat?: boolean;
    highlighted?: boolean;
    linkText?: string;
}

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

const Pricing = () => {

    const { t } = useTranslation();

    const cards: PricingCardProps[] = [
    {
      price: "35.3€",
      priceDescription: t("document"),
      description: t("standardDocuments"),
      features: [t("birth"), t("marry"), t("registration")],
      showVat: true,
      linkText: t("offer")
    },
    {
      price: "1.4€",
      priceDescription: t("line"),
      description: t("variableDocuments"),
      features: [t("workBook"), t("educationDocuments"), t("certificates")],
      showVat: true,
      linkText: t("offer")
    },
    {
      title: t("uponRequest"),
      description: t("complicatedDocuments"),
      features: [t("diploma"), t("court"), t("findings")],
      highlighted: true,
      linkText: t("offer")
    },
  ];

    return (
        <>
        <div style={{padding: '1rem 2rem'}}>

            <div className="main-pricing-container">

                <div className="pricing-title">
                        <h1>{t('our')}</h1>
                        <h1 className="header-span">{t('prices')}</h1>
                </div>

                <div className="pricing-container">

                    {cards.map((card, idx) => (
                        <PricingCard key={idx} {...card}/>
                    ))}

                </div>

                <Divider style={{marginTop: '4rem'}}/>
                

                <Section image={pricing_first} imageClass="second-image" titleTextFirst={t('quality')} titleTextSecond={t('satisfaction')} text="qualityAndHappiness" order={true}/>


                <Divider style={{marginTop: '4rem', marginBottom: '2rem'}}/>

                <ContactSection text="pricingContact"/>

            </div>
            
        </div>
        <Footer/>
        </>
    )
}


export default Pricing;


