import { NextPage } from "next";
import { useState, useEffect } from "react";
import Terms from "../../Components/Terms/Index";

const TermsPage: NextPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <Terms /> : <></>;
};

export default TermsPage;
