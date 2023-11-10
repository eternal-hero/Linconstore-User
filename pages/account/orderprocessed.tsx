import {NextPage} from "next";
import OrdersProcessed from "../../Components/user/OrdersProcessed";
import Dashboard from "../../Components/Layouts/Account/Dashboard";

const OrderProcessedPage : NextPage = () => {
    return  (
    <Dashboard>
        <OrdersProcessed/>
    </Dashboard>
  )
}
export default OrderProcessedPage;