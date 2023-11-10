import { NextPage } from "next";
import PastOrders from "../../Components/user/PastOrders";
import Dashboard from "../../Components/Layouts/Account/Dashboard";

const PastOrdersPage: NextPage = () => {
  return  (
    <Dashboard>
        <PastOrders />
    </Dashboard>
  );
};
export default PastOrdersPage;
