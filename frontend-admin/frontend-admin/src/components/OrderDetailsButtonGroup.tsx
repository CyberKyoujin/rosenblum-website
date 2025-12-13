
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { MdEditSquare } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import { SetStateAction } from "react";

interface OrderDetailsButtonGroupProps {
    formActive: boolean;
    setFormActive: React.Dispatch<SetStateAction<boolean>>;
    setNotificationOpen: React.Dispatch<SetStateAction<boolean>>;
}

const OrderDetailsButtonGroup = ({

    formActive,
    setFormActive,
    setNotificationOpen

    }: OrderDetailsButtonGroupProps) => {


    return (
        <div className="order-btn-container">

                        <button
                            className="order-action-btn green-btn"
                            type="submit"
                            style={{display: formActive ? "flex" : "none"}}
                            >
                            
                            <FaCheck style={{ fontSize: '18px' }} /> Speichern
                                
                        </button>

                        <button
                            className="order-action-btn green-btn"
                            onClick={() => setFormActive(true)}
                            type="button"
                            style={{display: formActive ? "none" : "flex"}}
                            >
                            
                            <MdEditSquare style={{ fontSize: '18px' }} /> Bearbeiten
                                
                        </button>

                        <button 
                            className="order-action-btn red-btn"
                            onClick={() => {
                                if (formActive) {
                                    setFormActive(false);
                                } else {
                                    setNotificationOpen(true);
                                }
                            }}
                            type="button"
                            >
                            {formActive ? (
                                <>
                                <RxCross2 style={{fontSize: '18px'}}/> Abbrechen
                                </>
                            ) : (
                                <>
                                <FaRegTrashAlt style={{fontSize: '18px'}}/> Löschen
                                </>
                            )}
                        </button>
                    
                    </div>
    )
}

export default OrderDetailsButtonGroup