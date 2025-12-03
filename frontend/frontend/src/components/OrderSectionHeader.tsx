import { ReactElement } from "react";
import { IconType } from "react-icons/lib"

interface OrderSectionHeaderProps {
    Icon: IconType;
    headerText: string;
}

const OrderSectionHeader: React.FC<OrderSectionHeaderProps> = ({Icon, headerText}) => {
    return (
        <div className="oreder-contacts-header">
        
            <div className="step-number">
                <Icon style={{fontSize: '30px', marginTop: '3px'}}/>
            </div>
                           
            <h1>{headerText}</h1>
        
        </div>
    )
}

export default OrderSectionHeader