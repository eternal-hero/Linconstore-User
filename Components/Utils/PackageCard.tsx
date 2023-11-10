import {
  Button,
  Card,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useDispatch } from "react-redux";
import React, { useState } from "react";
import { useHandleSellerSub } from "../../hooks/useDataFetch";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import StoreInfo from "../Seller/StoreInfo";

interface Icard {
  type: string;
}
export const packages = [
  {
    packageName: "Basic",
    id: 1,
    limit: 4,
    plan: "BasicMonthly",
  },
  {
    packageName: "Essential",
    id: 2,
    limit: 10,
    plan: "EssentialMonthly",
  },
  {
    packageName: "Essential",
    id: 3,
    limit: 10,
    plan: "EssentialYearly",
  },
  {
    packageName: "Basic",
    id: 4,
    limit: 4,
    plan: "BasicYearly",
  },
  {
    packageName: "Premium",
    id: 5,
    limit: 20,
    plan: "PremiumMonthly",
  },
  {
    packageName: "Premium",
    id: 6,
    limit: 20,
    plan: "PremiumYearly",
  },
];
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const PackageCard: React.JSXElementConstructor<Icard> = ({ type }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [plan, setPlan] = useState<string>("");
  const handlePayment = (name: string) => {
    let plan: string;
    plan = name === "free" ? "free" : "premium";
    const data = {
      plan,
    };
    subscribe(data);
    setPlan(plan);
  };
  const onSuccess = (data: any) => {
    if (data.type === "free") {
      return;
    } else {
      localStorage.setItem("sellerSub", "sellerSub");
      router.push(data.url);
    }
  };
  const router = useRouter();
  const {
    isLoading,
    mutate: subscribe,
    isSuccess,
  } = useHandleSellerSub(onSuccess);


  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <>
      {!isSuccess && (
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "1200px"
          }}
        >
          <Typography variant={"h5"} sx={{ textAlign: "center" }} mb={5} mt={isMobile && 50}>
            {t("seller.setup.title")}
          </Typography>
          <Box
            sx={{
              maxHeight: { xs: "auto", sm: 370 },
              mt: 2,
              mb: isMobile && 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Card
              sx={{
                height: { xs: "370px", sm: "370px" },
                width: isMobile ? "100%" : "390px",
                borderRadius: "20px",
                boxShadow: "0 0 16px rgba(0, 0, 0, 0.2)",
                p: 2,
                position: "relative",
              }}
            >
              <Typography variant={"h5"} mb={1}>{t("seller.setup.month.basic.title")}</Typography>
              <Box display={"flex"} gap={2} alignItems={"baseline"}>
                <Typography pl={1} variant={"h5"} sx={{ color: "#00a859" }}>&#163;&nbsp;0&nbsp;&nbsp;</Typography>
                <Typography>/{t("seller.setup.month.title")}</Typography>
              </Box>
              <Box pl={3} mb={3} display={"flex"} flexDirection={"column"} color={"#00a859"}>
                <Typography my={1} fontSize={14}>{t("seller.setup.month.basic.content")}</Typography>
                <Typography my={1} fontSize={14}>{t("seller.setup.month.basic.ads")}</Typography>
                <Typography my={1} fontSize={14}>{t("seller.setup.month.basic.price")}</Typography>
                <Typography my={1} fontSize={14}>{t("seller.setup.month.basic.extra")}</Typography>
              </Box>
              <Button
                disabled={isLoading}
                variant="contained"
                sx={{
                  position: "absolute",
                  bottom: 20,
                  py: 2,
                  px: 3,
                }}

                onClick={() => handlePayment("free")}
              >
                {isLoading && plan === "free" && <CircularProgress />}
                {t("seller.setup.month.Get_Started")}
              </Button>
            </Card>
            <Card
              sx={{
                height: { xs: "370px", sm: "370px" },
                width: isMobile ? "100%" : "390px",
                borderRadius: "20px",
                boxShadow: "0 0 16px rgba(0, 0, 0, 0.2)",
                p: 2,
                position: "relative",
              }}
            >
              <Typography variant={"h5"} mb={1}>{t("seller.setup.month.premium.title")}</Typography>
              <Box display={"flex"} gap={2} alignItems={"baseline"}>
                <Typography pl={1} variant={"h5"} sx={{ color: "#00a859" }}>&#163;&nbsp;25&nbsp;&nbsp;</Typography>
                <Typography>/{t("seller.setup.month.title")}</Typography>
              </Box>
              <Box pl={3} mb={3} display={"flex"} flexDirection={"column"} color={"#00a859"}>
                <Typography my={1} fontSize={14}>{t("seller.setup.month.premium.content")}</Typography>
                <Typography my={1} fontSize={14}>{t("seller.setup.month.premium.ads")}</Typography>
                <Typography my={1} fontSize={14}>{t("seller.setup.month.premium.price")}</Typography>
                <Typography my={1} fontSize={14}>{t("seller.setup.month.premium.invoice")}</Typography>
                <Typography my={1} fontSize={14}>{t("seller.setup.month.premium.extra")}</Typography>
              </Box>
              <Button
                disabled={isLoading}
                variant="contained"
                sx={{
                  position: "absolute",
                  bottom: 20,
                  py: 2,
                  px: 3,
                }}

                onClick={() => handlePayment("premium")}
              >
                {isLoading && plan === "premium" && <CircularProgress />}
                {t("seller.setup.month.Get_Started")}
              </Button>
            </Card>
          </Box>
        </Box>
      )}

      {isSuccess && plan === "free" && <StoreInfo />}
    </>
  );
};
export default PackageCard;
