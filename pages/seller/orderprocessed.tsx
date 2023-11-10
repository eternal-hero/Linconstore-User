import { NextPage } from "next";
import Dashboard from "../../Components/Layouts/Seller/Dashboard";
import OrdersProcessed from "../../Components/Seller/OrderProcessed";

const OrderProcessedPage: NextPage = () => {
  return (
    <Dashboard>
      <OrdersProcessed />
    </Dashboard>
  );
};
export default OrderProcessedPage;
