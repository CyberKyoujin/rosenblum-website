import { SetStateAction, useState } from "react";
import { Order } from "../types/order";
import { useNavigate } from "react-router-dom";

interface UseOrderDetailsReturn {
    formActive: boolean;
    status: string;
    orderType: string;
    notificationOpen: boolean;
    setFormActive: React.Dispatch<SetStateAction<boolean>>;
    setStatus: React.Dispatch<SetStateAction<string>>;
    setOrderType: React.Dispatch<SetStateAction<string>>;
    setNotificationOpen: React.Dispatch<SetStateAction<boolean>>;
    fetchUserOrder: () => Promise<void>;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    handleDelete: () => Promise<void>;
}

export const useOrderDetails = (

    orderData: Order | null,
    fetchOrder: (id: number) => Promise<void>,
    formattedOrderId: number,
    updateOrder: (id: number, status: string, order_type: string) => Promise<void>,
    deleteOrder: (id: number) => Promise<void>,

    ) : UseOrderDetailsReturn => {

    const navigate = useNavigate();

    const [formActive, setFormActive] = useState<boolean>(false);
    const [status, setStatus] = useState<string>(orderData?.status || "review");
    const [orderType, setOrderType] = useState<string>(orderData?.order_type || "review");
    const [notificationOpen, setNotificationOpen] = useState<boolean>(false);

    const fetchUserOrder = async () => {

        try {
            fetchOrder(formattedOrderId)
            
        } catch (error) {
            console.log(error);
        
        };

    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
            
        try {
    
            await updateOrder(formattedOrderId, status, orderType); 
            await fetchUserOrder();
            setFormActive(false);
    
        } catch (error) {

            console.log("Error updating the order: ", error);

        }
            
    };

    const handleDelete = async () => {

        try { 

            deleteOrder(formattedOrderId);
            navigate('/dashboard', { state: { message: "Order successfully deleted!" } });
            setNotificationOpen(false);
            
        } catch (error) {
            console.log("Error deleting the order: ", error);
        }

    }

    return {
        formActive,
        setFormActive,
        status,
        orderType,
        setOrderType,
        setStatus,
        notificationOpen,
        setNotificationOpen,
        fetchUserOrder,
        handleSubmit,
        handleDelete
    };

}