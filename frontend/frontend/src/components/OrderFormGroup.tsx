import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const CustomTooltip = ({ title, children }: { title: string; children: React.ReactElement }) => {
  return (
    <Tooltip
      title={title}
      arrow
      placement="bottom"
      enterTouchDelay={0}

      slotProps={{
        tooltip: {

          sx: {
            backgroundColor: "#ffff" ,
            color: 'black',
            fontSize: '0.8rem',
            border: '1px solid #4C79D4',
            padding: '10px 15px',
            lineHeight: "1.5rem"
          },
        },
        arrow: {
          sx: {
            color: "#4C79D4",
          },
        },
      }}
    >
      {children}
    </Tooltip>
  );
};

const OrderFormGroup = () => {

    const tooltipText = "Kostenvoranschlag (смета) — это предварительный расчет стоимости услуг или товаров, который не является юридически обязывающим.";

    return (

        <FormGroup className="order-checkbox-container">

            <div>
                <FormControlLabel control={<Checkbox defaultChecked />} label="Ich brauche einen Kostenvorschlag" />

                    <CustomTooltip title={tooltipText}>
                        <IconButton className="app-icon">
                            <HelpOutlineIcon className="app-icon"/>
                        </IconButton>
                    </CustomTooltip>
            </div>

                <FormControlLabel required control={<Checkbox defaultChecked/>} label="Ich bin sicher" />

        </FormGroup>
        
    )
}

export default OrderFormGroup