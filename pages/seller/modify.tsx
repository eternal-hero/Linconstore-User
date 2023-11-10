import { NextPage } from "next";
import Dashboard from "../../Components/Layouts/Seller/Dashboard";
import Modify from "../../Components/Seller/Modify";

const ModifyPage: NextPage = () => {
  return (
    <Dashboard>
      <Modify />
    </Dashboard>
  );
};
export default ModifyPage;
