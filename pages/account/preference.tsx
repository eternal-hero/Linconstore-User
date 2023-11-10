import { NextPage } from "next";
import Preferences from "../../Components/user/Preferences";
import Dashboard from "../../Components/Layouts/Account/Dashboard";

const AppPreference: NextPage = () => {
  return (
    <Dashboard>
      <Preferences />
    </Dashboard>
  )
}
export default AppPreference;