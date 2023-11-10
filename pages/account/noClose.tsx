import { NextPage } from "next";
import NoClosePage from "../../Components/user/NoClosePage";
import Dashboard from "../../Components/Layouts/Account/Dashboard";

const CloseAccount: NextPage = () => {
  return (
    <Dashboard>
      <NoClosePage />;
    </Dashboard>
  )
};
export default CloseAccount;
