import { NextPage } from "next";
import Shop from "../../Components/Seller/Shop";
import Dashboard from "../../Components/Layouts/Seller/Dashboard";

const Stats: NextPage = () => {
  return (
    <Dashboard>
      <Shop />
    </Dashboard>
  );
};
export default Stats;
