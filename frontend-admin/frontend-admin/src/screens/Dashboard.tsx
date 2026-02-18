import { CiBoxList } from "react-icons/ci";
import { IoDocumentTextOutline } from "react-icons/io5";
import DashboardSection from "../components/DashboardSection";
import Order from "../components/Order";
import ApiErrorAlert from "../components/ApiErrorAlert";
import { useIsAtTop } from "../hooks/useIsAtTop";
import useOrdersStore from "../zustand/useOrdersStore";
import OrderFilter from "../components/OrderFilter";


const Dashboard = () => {

    // AUFTRÄGE (order_type = order)
    const orders = useOrdersStore(s => s.orders);
    const ordersLoading = useOrdersStore(s => s.loading);
    const ordersError = useOrdersStore(s => s.error);
    const fetchOrders = useOrdersStore(s => s.fetchOrders);
    const setOrdersFilters = useOrdersStore(s => s.setFilters);

    // KOSTENVORANSCHLÄGE (order_type = kostenvoranschlag)
    const kvOrders = useOrdersStore(s => s.kostenvoranschlagOrders);
    const kvLoading = useOrdersStore(s => s.kostenvoranschlagLoading);
    const kvError = useOrdersStore(s => s.kostenvoranschlagError);
    const fetchKvOrders = useOrdersStore(s => s.fetchKostenvoranschlagOrders);
    const setKvFilters = useOrdersStore(s => s.setKostenvoranschlagFilters);

    const error = useOrdersStore(s => s.error);
    const isAtTop = useIsAtTop(5);

    return (
        <>
            <ApiErrorAlert error={error} belowNavbar={isAtTop} fixed={true}/>

            <div className="main-container">
                <div className="dashboard-container">

                    <DashboardSection
                        data={orders}
                        title="Aufträge"
                        Icon={CiBoxList}
                        fetchData={fetchOrders}
                        ItemComponent={Order}
                        loading={ordersLoading}
                        error={ordersError}
                        setFilters={setOrdersFilters}
                        Filter={OrderFilter}
                    />

                    <DashboardSection
                        data={kvOrders}
                        title="Kostenvoranschläge"
                        Icon={IoDocumentTextOutline}
                        fetchData={fetchKvOrders}
                        ItemComponent={Order}
                        loading={kvLoading}
                        error={kvError}
                        setFilters={setKvFilters}
                        Filter={OrderFilter}
                    />

                </div>
            </div>
        </>
    );
};


export default Dashboard;
