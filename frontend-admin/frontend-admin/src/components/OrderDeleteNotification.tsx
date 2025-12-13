import { SetStateAction } from "react";


interface OrderDeleteNotificationProps {
    notificationOpen: boolean;
    setNotificationOpen: React.Dispatch<SetStateAction<boolean>>;
    handleDelete: () => Promise<void>;
}

const OrderDeleteNotification = ({

    notificationOpen,
    setNotificationOpen,
    handleDelete

    } : OrderDeleteNotificationProps) => {


    return(

        <>

            <div
            className={notificationOpen ? "overlay show" : "overlay"}
            onClick={() => setNotificationOpen(false)}
            />

            <div className={notificationOpen ? "confirm-notification-container show-flex" : "confirm-notification-container"}>
                
                <p>Wollen Sie den Auftrag löschen?</p>

                    <div className="notification-btn-container">

                        <button 
                        className="notification-btn-confirm"
                        onClick={handleDelete}
                        type="button"
                        >Löschen</button>

                        <button 
                        className="notification-btn-cancel"
                        onClick={() => setNotificationOpen(false)}
                        type="button"
                        >Abbrechen</button>

                    </div>

            </div>

        </>

    )
}


export default OrderDeleteNotification