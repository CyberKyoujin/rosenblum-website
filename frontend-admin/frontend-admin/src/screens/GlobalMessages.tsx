
import DashboardSection from "../components/DashboardSection"
import useMessages from "../zustand/useMessages"
import { BiSolidMessageDetail } from "react-icons/bi";
import MessageItem from "../components/MessageItem";
import MessageFilter from "../components/MessageFilter"; 
import { useEffect } from "react";
import ApiErrorAlert from "../components/ApiErrorAlert";
import { useIsAtTop } from "../hooks/useIsAtTop";

const GlobalMessages = () => {


    const messages = useMessages(s => s.messages);
    const messagesLoading = useMessages(s => s.messagesLoading);
    const messagesError = useMessages(s => s.fetchMessagesError);

    const sendMessage = useMessages(s => s.sendMessage);
    const toggleMessages = useMessages(s => s.toggleMessages);

    const isAtTop = useIsAtTop(5);

    const fetchMessages = useMessages(s => s.fetchMessages);
    const setMessagesFilters = useMessages(s => s.setFilters);

   useEffect(() => {
    fetchMessages(1);
   }, [sendMessage, toggleMessages])


    return (

        <div className="main-container">

            <ApiErrorAlert error={messagesError} belowNavbar={isAtTop} fixed/>

            <div className="dashboard-container">

                <DashboardSection data={messages} title="Nachrichten" Icon={BiSolidMessageDetail} fetchData={fetchMessages} ItemComponent={MessageItem} loading={messagesLoading} error={messagesError} setFilters={setMessagesFilters} Filter={MessageFilter}/>

            </div>

        </div>
    )
}


export default GlobalMessages