import { IoCheckmark, IoCreateOutline, IoCloseOutline, IoTrashOutline } from "react-icons/io5";
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
        <div className="od__btn-group">
            {formActive ? (
                <>
                    <button key="save" className="od__btn od__btn--primary" type="submit">
                        <IoCheckmark /> Speichern
                    </button>
                    <button
                        key="cancel"
                        className="od__btn od__btn--ghost"
                        type="button"
                        onClick={() => setFormActive(false)}
                    >
                        <IoCloseOutline /> Abbrechen
                    </button>
                </>
            ) : (
                <>
                    <button
                        key="edit"
                        className="od__btn od__btn--primary"
                        type="button"
                        onClick={() => setFormActive(true)}
                    >
                        <IoCreateOutline /> Bearbeiten
                    </button>
                    <button
                        key="delete"
                        className="od__btn od__btn--danger"
                        type="button"
                        onClick={() => setNotificationOpen(true)}
                    >
                        <IoTrashOutline /> Löschen
                    </button>
                </>
            )}
        </div>
    );
};

export default OrderDetailsButtonGroup;