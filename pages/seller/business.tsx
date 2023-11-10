import { NextPage } from "next";
import Dashboard from "../../Components/Layouts/Seller/Dashboard";
import BusinessPlan from "../../Components/Seller/BusinessPlan";

const Business: NextPage = () => {
  return (
    <Dashboard>
      <BusinessPlan />
    </Dashboard>
  );
};
export default Business;
