import Divider from '@mui/material/Divider';
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import ContactSection from "../components/ContactSection";
import Section from "../components/Section"
import pricing_first from "../assets/pricing_first.jpg"
import PricingCard from "../components/PricingCard";


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
        <div className='main-app-container'>

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


