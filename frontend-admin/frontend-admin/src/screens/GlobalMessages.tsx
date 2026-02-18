import DashboardSection from "../components/DashboardSection"
import useMessages from "../zustand/useMessages"
import { BiSolidMessageDetail } from "react-icons/bi";
import { IoChatbubbleOutline } from "react-icons/io5";
import MessageItem from "../components/MessageItem";
import MessageFilter from "../components/MessageFilter";
import Request from "../components/Request";
import RequestsFilter from "../components/RequestFilter";
import { useEffect } from "react";
import ApiErrorAlert from "../components/ApiErrorAlert";
import { useIsAtTop } from "../hooks/useIsAtTop";
import useRequestsStore from "../zustand/useRequests";

const GlobalMessages = () => {

    // NACHRICHTEN
    const messages = useMessages(s => s.messages);
    const messagesLoading = useMessages(s => s.messagesLoading);
    const messagesError = useMessages(s => s.fetchMessagesError);
    const sendMessage = useMessages(s => s.sendMessage);
    const toggleMessages = useMessages(s => s.toggleMessages);
    const fetchMessages = useMessages(s => s.fetchMessages);
    const setMessagesFilters = useMessages(s => s.setFilters);

    // ANFRAGEN
    const requests = useRequestsStore(s => s.requests);
    const requestLoading = useRequestsStore(s => s.loading);
    const requestsError = useRequestsStore(s => s.error);
    const fetchRequests = useRequestsStore(s => s.fetchRequests);
    const setRequestFilters = useRequestsStore(s => s.setFilters);

    const isAtTop = useIsAtTop(5);

    useEffect(() => {
        fetchMessages(1);
    }, [sendMessage, toggleMessages]);

    return (
        <div className="main-container">

            <ApiErrorAlert error={messagesError} belowNavbar={isAtTop} fixed/>

            <div className="dashboard-container">

                <DashboardSection
                    data={messages}
                    title="Nachrichten"
                    Icon={BiSolidMessageDetail}
                    fetchData={fetchMessages}
                    ItemComponent={MessageItem}
                    loading={messagesLoading}
                    error={messagesError}
                    setFilters={setMessagesFilters}
                    Filter={MessageFilter}
                />

                <DashboardSection
                    data={requests}
                    title="Anfragen"
                    Icon={IoChatbubbleOutline}
                    fetchData={fetchRequests}
                    ItemComponent={Request}
                    loading={requestLoading}
                    error={requestsError}
                    setFilters={setRequestFilters}
                    Filter={RequestsFilter}
                />

            </div>

        </div>
    );
};


export default GlobalMessages;
