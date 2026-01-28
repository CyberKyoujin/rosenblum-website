import Divider from '@mui/material/Divider';
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import ContactSection from "../components/ContactSection";
import Section from "../components/Section"
import PricingCard from "../components/PricingCard";
import DocumentPrices from "../components/DocumentPrices";
import PricingExamples from "../components/PricingExamples";
import qualityIcon from "../assets/quality_image.webp"
import NavigationSection from '../components/NavigationSection';

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

            <NavigationSection first_link='Preise'/>

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

                <Section image={qualityIcon} imageClass="second-image" titleTextFirst={t('quality')} titleTextSecond={t('satisfaction')} text="qualityAndHappiness" order={true}/>
                
                <Divider style={{marginTop: '4rem', marginBottom: '2rem'}}/>

                <ContactSection order={false} text="pricingContact"/>

            </div>
            
        </div>
        <Footer/>
        </>
    )
}


export default Pricing;


