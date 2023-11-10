import { NextPage } from "next";
import PlacedOrders from "../../Components/user/OrdersPlaced";
import Dashboard from "../../Components/Layouts/Account/Dashboard";

const OrdersPlaced: NextPage = () => {
  return (
    <Dashboard>
      <PlacedOrders />
    </Dashboard>
  );
};
export default OrdersPlaced;
