import { NextPage } from "next";
import Checkout from "../../Components/Checkout/Checkout";
import Dashboard from "../../Components/Layouts/Account/Dashboard";

const CheckoutPage: NextPage = () => {
  return  (
    <Dashboard>
      <Checkout />;
    </Dashboard>
  )
};
export default CheckoutPage;
