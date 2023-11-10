import { NextPage } from "next";
import Security from "../../Components/user/Security";
import Dashboard from "../../Components/Layouts/Account/Dashboard";

const LoginSecurity: NextPage = () => {
  return (
    <Dashboard>
      <Security />;
    </Dashboard>
  )
};
export default LoginSecurity;
