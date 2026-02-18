import { IconType } from "react-icons/lib"

interface OrderSectionHeaderProps {
    Icon: IconType;
    headerText: string;
}

const OrderSectionHeader: React.FC<OrderSectionHeaderProps> = ({Icon, headerText}) => {
    return (
        <div className="oreder-contacts-header">
        
            <div className="step-number">
                <Icon size={20}/>
            </div>
                           
            <h1>{headerText}</h1>
        
        </div>
    )
}

export default OrderSectionHeader