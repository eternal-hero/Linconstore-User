import { NextPage } from "next";
import Dashboard from "../../Components/Layouts/Seller/Dashboard";
import OrdersPlaced from "../../Components/Seller/OrdersPlaced";

const OrderPlacedPage: NextPage = () => {
  return (
    <Dashboard>
      <OrdersPlaced />
    </Dashboard>
  );
};
export default OrderPlacedPage;
