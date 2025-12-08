
import DashboardSection from "../components/DashboardSection"
import useMessages from "../zustand/useMessages"
import { BiSolidMessageDetail } from "react-icons/bi";
import MessageItem from "../components/MessageItem";
import MessageFilter from "../components/MessageFilter"; 
import { useEffect } from "react";

const GlobalMessages = () => {


    const messages = useMessages(s => s.messages);
    const messagesLoading = useMessages(s => s.loading);
    const messagesError = useMessages(s => s.error);

    useEffect(() => {

        console.log(messages)

    }, [messages])


    const fetchMessages = useMessages(s => s.fetchMessages);
    const setMessagesFilters = useMessages(s => s.setFilters);

    return (
        <div className="main-container">
            <div className="dashboard-container">

                <DashboardSection data={messages} title="Nachrichten" Icon={BiSolidMessageDetail} fetchData={fetchMessages} ItemComponent={MessageItem} loading={messagesLoading} error={messagesError} setFilters={setMessagesFilters} Filter={MessageFilter}/>

            </div>
        </div>
    )
}


export default GlobalMessages