import { NextPage } from "next";
import Store from "../../Components/Seller/Store";
import Dashboard from "../../Components/Layouts/Seller/Dashboard";

const StorePage: NextPage = () => {
  return (
    <Dashboard>
      <Store />
    </Dashboard>
  );
};
export default StorePage;
