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
import { IoDocuments, IoCard } from "react-icons/io5";
import OrderDocsUpload from './OrderDocsUpload';
import { IoArrowBack } from "react-icons/io5";
import OrderSummary from './OrderSummary';
import { CircularProgress } from '@mui/material';

interface Step {
    icon: IconType;
    label: string;
    stepElement: React.ComponentType<{logic: any}>;
    complete: boolean;
}

const steps: Step[] = [
    {
        icon: FaUserCircle, label: "Kontaktdaten", stepElement: OrderContactsSection, complete: false
    },
    {
        icon: AiFillMessage, label: "Nachricht", stepElement: OrderMessageSection, complete: false
    },
    {
        icon: IoDocuments, label: "Unterlagen", stepElement: OrderDocsUpload, complete: false
    },
    {
        icon: IoCard, label: "Bestellübersicht", stepElement: OrderSummary, complete: false
    },
];

const stepFields: Record<number, (keyof OrderFormValues)[]> = {
  0: ['name', 'email', 'phone_number', 'city', 'street', 'zip'],
  1: ['message'],
  //  2 — файлы (без полей формы)
};



export default function OrderStepper({logic}: {logic?: any}) {
  const [activeStep, setActiveStep] = React.useState(0);

  const StepComponent = steps[activeStep]?.stepElement;


  const isStepOptional = (_step: number) => {
    return false;
  };

  const renderSubmitButton = () => {
  const { method } = logic.payment;
  const disabled = !logic.canSubmit || logic.loading;

  if (method === "kostenvoranschlag") {
    return <button onClick={logic.onSubmit} disabled={disabled} className='step-next-btn quote-btn'>
      {logic.loading ? <CircularProgress sx={{color: "white"}}/> : "KOSTENVORANSCHLAG ANFORDERN"}
      </button>;
  }

  if (method === "rechnung") {
    return <button onClick={logic.onSubmit} disabled={disabled} className='step-next-btn invoice-btn'>
      {logic.loading ? <CircularProgress sx={{color: "white"}}/> : "BESTELLEN UND MIT RECHNUNG BEZAHLEN"}
      </button>;
  }

  if (method === "stripe") {
    return <button onClick={logic.onSubmit} disabled={disabled} className='step-next-btn stripe-btn'>
      {logic.loading ? <CircularProgress sx={{color: "white"}}/> : "MIT STRIPE BEZAHLEN"}
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

    steps[activeStep].complete = true;

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
    

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ width: '100%' }} className="order-stepper-container">

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
          
          return (
            <Step key={step.label} {...stepProps}>

                <div className='step-info'>
                    <div className='step-icon' style={{backgroundColor: index === activeStep || step.complete ? "#4C79D4" : "grey"}}>
                        {step.complete ? <DoneAllIcon sx={{ fontSize: 20 }} /> : <step.icon color='white' size={24} />}
                    </div>
                    
                    <p className='step-info-text'>{step.label}</p>
                </div>
              
            </Step>
          );
        })}
      </Stepper>

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
              <IoArrowBack /> ZURÜCK
            </button>
            <Box sx={{ flex: '1 1 auto' }} />
            

              { activeStep === steps.length - 1 ? renderSubmitButton() : (
                <button onClick={handleNext} className='step-next-btn'>WEITER</button>
              )}


            </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
