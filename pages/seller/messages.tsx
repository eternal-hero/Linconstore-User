import { NextPage } from "next";
import Message from "../../Components/Seller/Message";
import Dashboard from "../../Components/Layouts/Seller/Dashboard";

const Messages: NextPage = () => {
  return (
    <Dashboard>
      <Message />
    </Dashboard>
  );
};
export default Messages;
