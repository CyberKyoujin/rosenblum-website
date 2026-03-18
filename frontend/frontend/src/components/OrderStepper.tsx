import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { IconType } from 'react-icons/lib';
import { FaUserCircle } from "react-icons/fa";
import { OrderContactsSection } from './OrderContactsSection';
import { OrderFormValues } from '../hooks/useOrder';
import { AiFillMessage } from "react-icons/ai";
import OrderMessageSection from './OrderMessageSection';
import { IoDocuments, IoCard, IoArrowBack, IoInformationCircleOutline } from "react-icons/io5";
import OrderDocsUpload from './OrderDocsUpload';
import { Link } from 'react-router-dom';
import OrderSummary from './OrderSummary';
import { CircularProgress } from '@mui/material';
import ApiErrorAlert from './ApiErrorAlert';
import { ApiErrorResponse } from '../types/error';
import { useIsAtTop } from '../hooks/useIsAtTop';
import { t } from 'i18next';

interface Step {
    icon: IconType;
    label: string;
    stepElement: React.ComponentType<{logic: any}>;
    complete: boolean;
}

const stepFields: Record<number, (keyof OrderFormValues)[]> = {
  0: ['name', 'email', 'phone_number', 'city', 'street', 'zip'],
  1: ['message'],
};

export default function OrderStepper({logic}: {logic?: any}) {
  const [activeStep, setActiveStep] = React.useState(0);

  React.useEffect(() => {
    window.history.pushState(null, '');

    const handlePopState = () => {
      if (activeStep > 0) {
        window.history.pushState(null, '');
        setActiveStep(prev => prev - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeStep]);

  const steps: Step[] = [
    {
        icon: FaUserCircle, label: t('contactDetails'), stepElement: OrderContactsSection, complete: false
    },
    {
        icon: AiFillMessage, label: t('stepMessage'), stepElement: OrderMessageSection, complete: false
    },
    {
        icon: IoDocuments, label: t('stepDocuments'), stepElement: OrderDocsUpload, complete: false
    },
    {
        icon: IoCard, label: t('stepOrderSummary'), stepElement: OrderSummary, complete: false
    },
  ];

  const StepComponent = steps[activeStep]?.stepElement;

  const [docsError, setDocsError] = React.useState<ApiErrorResponse | null>(null);

  const isAtTop = useIsAtTop(5);

  const isStepOptional = (_step: number) => {
    return false;
  };

  const renderSubmitButton = () => {
  const { method } = logic.payment;
  const disabled = !logic.canSubmit || logic.loading;

  if (method === "kostenvoranschlag") {
    return <button onClick={logic.onSubmit} disabled={disabled} className='step-next-btn quote-btn'>
      {logic.loading ? <CircularProgress sx={{color: "white"}}/> : t('requestQuoteButton')}
      </button>;
  }

  if (method === "rechnung") {
    return <button onClick={logic.onSubmit} disabled={disabled} className='step-next-btn invoice-btn'>
      {logic.loading ? <CircularProgress sx={{color: "white"}}/> : t('orderAndPayByInvoiceButton')}
      </button>;
  }

  if (method === "stripe") {
    return <button onClick={logic.onSubmit} disabled={disabled} className='step-next-btn stripe-btn'>
      {logic.loading ? <CircularProgress sx={{color: "white"}}/> : t('payWithStripeButton')}
      </button>;
  }

  return null;
  };


  const handleNext = async () =>{

    const fields = stepFields[activeStep];

    if (fields) {
        const valid = await logic.methods.trigger(fields);
        if (!valid) return;
    }

    if (activeStep == 2){

      if (logic.files.list.length <= 0 || logic.docs.list.length <= 0) {
        setDocsError({status: 200, code: "", message: t('addDocumentsRequired')});
        return;
      }
      setDocsError(null);
    }

    steps[activeStep].complete = true;

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ width: '100%' }} className="order-stepper-container">

      <ApiErrorAlert error={docsError} fixed belowNavbar={isAtTop}/>

      <Stepper activeStep={activeStep} className='stepper'>
        {steps.map((step, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          
          const isClickable = index < activeStep || step.complete;

          return (
            <Step key={step.label} {...stepProps}>

                <div
                  className='step-info'
                  onClick={() => {
                    if (isClickable) {
                      setActiveStep(index);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  style={{ cursor: isClickable ? 'pointer' : 'default' }}
                >
                    <div className='step-icon' style={{backgroundColor: index === activeStep || step.complete ? "#4C79D4" : "grey"}}>
                        {step.complete ? <DoneAllIcon sx={{ fontSize: 20 }} /> : <step.icon color='white' size={24} />}
                    </div>

                    <p className='step-info-text'>{step.label}</p>
                </div>

            </Step>
          );
        })}
      </Stepper>

      {activeStep === 0 && (
        <div className="order-info-banner">
          <IoInformationCircleOutline className="order-info-banner__icon" />
          <p className="order-info-banner__text">
            {t('orderBannerText1')} <Link to="/pricing" className="order-info-banner__link">{t('orderBannerPrices')}</Link> {t('orderBannerOr')} <Link to="/faq" className="order-info-banner__link">{t('orderBannerFaq')}</Link> {t('orderBannerText2')} <Link to="/contact-us" className="order-info-banner__link">{t('orderBannerContact')}</Link>.
          </p>
        </div>
      )}

      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>

          {StepComponent && <StepComponent logic={logic} />}


          <Box  className="step-button-group">
            <button
              className="step-back-btn"
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              <IoArrowBack /> {t('back').toUpperCase()}
            </button>
            <Box sx={{ flex: '1 1 auto' }} />


              { activeStep === steps.length - 1 ? renderSubmitButton() : (
                <button onClick={handleNext} className='step-next-btn'>{t('next')}</button>
              )}


            </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
