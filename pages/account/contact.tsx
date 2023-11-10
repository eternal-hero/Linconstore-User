import {NextPage} from "next";
import Contact from "../../Components/user/Contact";
import Dashboard from "../../Components/Layouts/Account/Dashboard";

const ContactPage : NextPage = () => {
    return (
        <Dashboard>
            <Contact/>
        </Dashboard>
      )
}
export default ContactPage;
