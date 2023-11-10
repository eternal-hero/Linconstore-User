import { NextPage } from "next";
import Refund from "../../Components/Seller/Refund";
import Dashboard from "../../Components/Layouts/Seller/Dashboard";

const RefundPage: NextPage = () => {
  return (
    <Dashboard>
      <Refund />
    </Dashboard>
  );
};
export default RefundPage;
