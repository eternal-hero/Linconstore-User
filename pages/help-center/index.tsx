import { NextPage } from "next";
import { useState, useEffect } from "react";
import HelpCenterPage from "../../Components/HelpCenterPage";

const HelpCenter: NextPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <HelpCenterPage /> : <></>;
};

export default HelpCenter;