import React from "react";
import { NextPage } from "next";
import Messages from "../../Components/user/Messages";
import Dashboard from "../../Components/Layouts/Account/Dashboard";

const MessagePage: NextPage = () => {
  return (
    <Dashboard>
      <Messages />;
    </Dashboard>
  )
};
export default MessagePage;
