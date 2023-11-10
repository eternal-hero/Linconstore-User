import { NextPage } from "next";
import Business from "../../Components/Seller/Business";
import { useEffect, useState } from "react";
import StoreInfo from "../../Components/Seller/StoreInfo";
import { useRouter } from "next/router";
import CssBaseline from "@mui/material/CssBaseline";
import * as React from "react";
import { Box } from "@mui/system";
import Cookies from "js-cookie";

const VerifyPage: NextPage = () => {
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    setIsLoading(false);
    const clear = setTimeout(() => {
      // const status = localStorage.getItem("status");
      const status = Cookies.get("status");
      setStatus(status);
      if (status === "seller") router.push("/seller");

      if (!status) {
        setIsComplete(true);
      }
    }, 1000);
    setIsLoading(true);
    return () => {
      setIsLoading(false);
      clearTimeout(clear);
    };
  }, []);
  return (
    <>
      <CssBaseline />
      {isComplete && <Business />}

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* {isLoading && <CircularProgress />} */}
        {status === "inComplete" && <StoreInfo />}{" "}
        {status === "invalid" && <Business />}
      </Box>
    </>
  );
};

export default VerifyPage;
