import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IconType } from 'react-icons/lib';
import { IoHelpCircleOutline, IoSendOutline, IoCardOutline, IoDocumentTextOutline } from 'react-icons/io5';

interface AccordionItem {
  title: string;
  text: string;
  secondaryText?: boolean;
  link?: string;
  linkText?: string;
}

interface AccordionCategory {
  titleKey: string;
  Icon: IconType;
  items: AccordionItem[];
}

const categories: AccordionCategory[] = [
  {
    titleKey: 'faqCatGeneral',
    Icon: IoHelpCircleOutline,
    items: [
      { title: 'accordionTitleFirst', text: 'accordionTextFirst', secondaryText: true, link: 'order', linkText: 'offer' },
      { title: 'accordionTitleThird', text: 'accordionTextThird', link: 'languages', linkText: 'languages' },
      { title: 'accordionTitleSixth', text: 'accordionTextSixth' },
      { title: 'accordionTitleNinth', text: 'accordionTextNinth' },
    ],
  },
  {
    titleKey: 'faqCatOrder',
    Icon: IoSendOutline,
    items: [
      { title: 'accordionTitleTenth', text: 'accordionTextTenth', link: 'order', linkText: 'sendDokuments' },
      { title: 'accordionTitleSecond', text: 'accordionTextSecond' },
      { title: 'accordionTitleEleventh', text: 'accordionTextEleventh' },
      { title: 'accordionTitleTwelfth', text: 'accordionTextTwelfth', link: 'order', linkText: 'register' },
    ],
  },
  {
    titleKey: 'faqCatPayment',
    Icon: IoCardOutline,
    items: [
      { title: 'accordionTitleFourth', text: 'accordionTextFourth', link: 'pricing', linkText: 'prices' },
      { title: 'accordionTitleThirteenth', text: 'accordionTextThirteenth' },
      { title: 'accordionTitleFourteenth', text: 'accordionTextFourteenth' },
      { title: 'accordionTitleEights', text: 'accordionTextEights', link: 'contact-us', linkText: 'contactUsFull' },
    ],
  },
  {
    titleKey: 'faqCatDocuments',
    Icon: IoDocumentTextOutline,
    items: [
      { title: 'accordionTitleFifth', text: 'accordionTextFifth', link: 'sworn-translations', linkText: 'swornTranslations' },
      { title: 'accordionTitleSeventh', text: 'accordionTextSeventh', link: 'sworn-translations', linkText: 'verbalTranslations' },
    ],
  },
];

const FAQAccordion: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="faq-categories">
      {categories.map((category) => (
        <div className="faq-category" key={category.titleKey}>
          <div className="faq-category-header">
            <category.Icon />
            <h3>{t(category.titleKey)}</h3>
          </div>

          {category.items.map((item, idx) => (
            <Accordion
              className="faq-accordion-item"
              key={idx}
              disableGutters
              elevation={0}
            >
              <AccordionSummary
                expandIcon={<ArrowDownwardIcon className="app-icon" />}
                aria-controls={`${category.titleKey}-${idx}-content`}
                id={`${category.titleKey}-${idx}-header`}
              >
                <Typography className="faq-accordion-question">{t(item.title)}</Typography>
              </AccordionSummary>
              <AccordionDetails className="faq-accordion-details">
                <Typography className="faq-accordion-answer">
                  {t(item.text)}
                  {item.secondaryText && (
                    <p style={{ marginTop: '1rem' }}>
                      <span style={{ fontWeight: '600' }}>Email: </span>
                      rosenblum.uebersetzungsbuero@gmail.com
                    </p>
                  )}
                </Typography>
                {item.link && (
                  <Link to={`/${item.link}`} className="accordion-btn hover-btn">
                    {item.linkText ? t(item.linkText) : t('learnMore')}
                  </Link>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FAQAccordion;
