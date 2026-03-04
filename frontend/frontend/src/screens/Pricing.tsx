import Divider from '@mui/material/Divider';
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import ContactSection from "../components/ContactSection";
import PricingCard from "../components/PricingCard";
import DocumentPrices from "../components/DocumentPrices";
import PricingExamples from "../components/PricingExamples";
import PriceCalculator from '../components/PriceCalculator';
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

                <Divider style={{marginTop: '4rem', marginBottom: '3rem'}}/>

                <DocumentPrices />

                <Divider style={{marginTop: '3rem', marginBottom: '1rem'}}/>

                <PricingExamples />

                <Divider style={{marginTop: '3rem'}}/>

                <PriceCalculator/>     

                <Divider style={{marginTop: '4rem', marginBottom: '2rem'}}/>

                <ContactSection order={false} text="pricingContact"/>

            </div>
            
        </div>
        <Footer/>
        </>
    )
}


export default Pricing;


