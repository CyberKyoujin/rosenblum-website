import React from "react";


interface Props {
    isOpened: boolean;
}


const MessagesDropdown: React.FC<Props> = ({ isOpened }) => {
    return(
        <div className={isOpened ? "messages-dropdown show-messages-dropdown" : "messages-dropdown"}>
            <p>Messages</p>
        </div>
    )
}


export default MessagesDropdown