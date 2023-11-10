import { NextPage } from "next";
import Dashboard from "../../Components/Layouts/Seller/Dashboard";
import OrderShipped from "../../Components/Seller/OrderShipped";

const OrderShippedPage: NextPage = () => {
  return (
    <Dashboard>
      <OrderShipped />
    </Dashboard>
  );
};
export default OrderShippedPage;
