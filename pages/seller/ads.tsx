import { NextPage } from "next";
import ManageAds from "../../Components/Seller/ManageAds";
import Dashboard from "../../Components/Layouts/Seller/Dashboard";

const Ads: NextPage = () => {
  return (
    <Dashboard>
      <ManageAds />
    </Dashboard>
  );
};
export default Ads;
