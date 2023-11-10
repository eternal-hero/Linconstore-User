import {
  Button,
  Card,
  CircularProgress,
  Grid,
  useMediaQuery,
} from "@mui/material";
import Head from "next/head";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import {
  useGetDeleteSellerSub,
  useGetSellerInfo,
  useGetSellerPortalSession,
  useHandleSellerSub,
  useSellerSub,
} from "../../hooks/useDataFetch";
import { reCreateDate } from "../../Helpers/getDate";
import ContextApi from "../../Store/context/ContextApi";
import { useTranslation } from "react-i18next";
import { useTokenRefetch } from "../../hooks/useRefresh";

interface IBusinessPlan {
  name: string;
  commission: string;
  extra: string;
  boxes: string;
  key: string;
  ads: string;
  month: string;
  year: string;
}
interface IData {
  endDate: Date | string;
}
interface ISession {
  url: string;
}
const BusinessPlan = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const { t } = useTranslation();

  const [initialPlan, setInitialPlan] = useState<string>("");

  const [currentPlan, setCurrentPlan] = useState<IBusinessPlan>();
  const [otherPlan, setOtherPlan] = useState<IBusinessPlan[]>([]);
  const onSuccess = (data: any) => {
    if (data.isVerified) {
      const current = plans.find((value) => value.key === data.package);
      const other = plans.filter((value) => value.key !== data.package);
      setCurrentPlan(current);
      setOtherPlan(other);
      setInitialPlan(data.package);
    }
  };
  const [endDate, setDate] = useState<Date | string>();
  const onSubSuccess = (data: IData) => {
    const newEndDate = data?.endDate;
    // @ts-ignore
    const newDate = reCreateDate((newEndDate * 1000) as unknown as string);
    setDate(newDate);
  };
  const { refetch: subRefetch, isFetched } = useSellerSub(onSubSuccess);
  useTokenRefetch(subRefetch);
  const [sellerPlan, setSellerPlan] = useState<string>("");
  const handleSubscription = (name: string) => {
    setSellerPlan(name);
    const selectedPlan: string = name === "free" ? "free" : "Premium";
    const plan = {
      plan: selectedPlan,
      type: "renew",
    };
    renew(plan);
  };
  const handleSellerRenew = (data: any) => {
    if (data.type === "free") {
      return refetch();
    }
    router.push(data?.url);
  };
  const isLoggedIn = useContext(ContextApi).isLoggedIn;
  const { data, isLoading, refetch, isError } = useGetSellerInfo(onSuccess);
  useEffect(() => {
    if (isError) {
      return;
    }
  }, [isError]);
  useTokenRefetch(refetch);
  const { isLoading: sellerIsLoading, mutate: renew } =
    useHandleSellerSub(handleSellerRenew);
  const handleLogouts = useContext(ContextApi).handleLogout;
  const handleLogout = () => {
    handleLogouts();
    router.push("/login");
  };
  const onCancelSuccess = () => {
    refetch();
  };
  const handleBilling = useCallback(() => {
    const data = {};
    fetchSellerSession(data);
  }, []);
  const onSellerSessionSuccess = (data: ISession) => {
    window.open(data.url, "_blank");
  };
  const { mutate: fetchSellerSession, isLoading: isFetching } =
    useGetSellerPortalSession(onSellerSessionSuccess);
  const { mutate: deleteSub, isLoading: isDeleting } =
    useGetDeleteSellerSub(onCancelSuccess);
  const handleDeleteSub = useCallback(() => {
    deleteSub();
  }, []);
  const plans: IBusinessPlan[] = [
    {
      name: t("seller.business_plan.plans.basic.name"),
      boxes: t("seller.business_plan.plans.basic.boxes"),
      ads: t("seller.business_plan.plans.basic.ads"),
      commission: t("seller.business_plan.plans.basic.commission"),
      extra: t("seller.business_plan.plans.basic.extra"),
      month: t("seller.business_plan.plans.basic.month"),
      year: "",
      key: "free",
    },
    {
      name: t("seller.business_plan.plans.premium.name"),
      boxes: t("seller.business_plan.plans.premium.boxes"),
      ads: t("seller.business_plan.plans.premium.ads"),
      month: t("seller.business_plan.plans.premium.month"),
      year: t("seller.business_plan.plans.premium.year"),
      extra: t("seller.business_plan.plans.premium.extra"),
      commission: t("seller.business_plan.plans.premium.commission"),
      key: "Premium",
    },
  ];
  return (
    <>
      <Head>
        <title>{t("pagetitle.BusinessPlan")}</title>
        <meta name={"Business Plan"} content={"These are Business Plan"} />
        <link rel="icon" href="/favicon-store.ico" />
      </Head>
      <Card elevation={0} sx={{ bgcolor: "transparent", mb: isMobile && 6, p: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {isMobile && (
            <ArrowBack onClick={() => router.back()} className={"pointer"} />
          )}
        </Box>
        {isLoading && <CircularProgress />}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography fontSize={20} my={2}>
            {t("seller.business_plan.current_plan")}
          </Typography>

          {currentPlan && (
            <Card
              sx={{
                height: { xs: "400px", sm: "370px" },
                width: isMobile ? "100%" : "390px",
                borderRadius: "20px",
                boxShadow: "0 0 16px rgba(0, 0, 0, 0.2)",
                p: 2,
                position: "relative",
              }}
            >
              <Box display={"flex"} justifyContent={"space-between"}>
                <Typography variant={"h5"} mb={1}>{currentPlan.name}</Typography>
                {initialPlan !== 'free' && isFetched &&
                  <Typography
                    sx={{ mt: 1, mx: 1, color: "#00a859" }}
                    variant={"caption"}
                    component={"p"}
                  >
                    {t("seller.business_plan.renews") + " " + endDate}
                  </Typography>
                }
              </Box>
              <Box display={"flex"} gap={2} alignItems={"baseline"}>
                <Typography pl={1} fontSize={20} sx={{ color: "#00a859" }}>&#163;&nbsp;{currentPlan.month}&nbsp;&nbsp;</Typography>
                <Typography>/Month</Typography>
              </Box>
              <Box pl={3} mb={3} display={"flex"} flexDirection={"column"} color={"#00a859"}>
                <Typography my={1} fontSize={14}>{currentPlan.boxes}</Typography>
                <Typography my={1} fontSize={14}>{currentPlan.ads}</Typography>
                <Typography my={1} fontSize={14}>{currentPlan.commission}</Typography>
                <Typography my={1} fontSize={14}>{currentPlan.extra}</Typography>
                <Typography my={1} fontSize={14}>{currentPlan.year}</Typography>
              </Box>
              {initialPlan === 'Premium' &&
                <Button
                  variant={'contained'}
                  color={'error'}
                  disabled={isDeleting}
                  onClick={handleDeleteSub}
                  sx={{
                    position: "absolute",
                    bottom: 20,
                    py: 2,
                    px: 3,
                  }}
                >
                  {isDeleting && <CircularProgress />}
                  {t("seller.business_plan.Downgrade")}
                </Button>
              }
            </Card>
          )}
          <Box width={isMobile ? "100%" : 370} display={"flex"} justifyContent={"space-between"} my={2} flexDirection={isMobile ? "column" : "row"}>
            <Typography fontSize={20} sx={{ my: 1 }} component={"h6"}>
              {t("seller.business_plan.change_plan")}{" "}
              {sellerIsLoading || (isFetching && <CircularProgress />)}
            </Typography>
            {initialPlan !== 'free' && isFetched &&
              <Button variant={"outlined"} sx={{ borderRadius: "10px" }} onClick={handleBilling}>
                {t("seller.business_plan.btn_manage")}
              </Button>
            }
          </Box>
          <Grid container spacing={2}>
            {otherPlan.length > 0 &&
              otherPlan.map((plan, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
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
                    <Typography variant={"h5"} mb={1}>{plan.name}</Typography>
                    <Box display={"flex"} gap={2} alignItems={"baseline"}>
                      <Typography pl={1} fontSize={20} sx={{ color: "#00a859" }}>&#163;&nbsp;{plan.month}&nbsp;&nbsp;</Typography>
                      <Typography>/{t("seller.business_plan.Month")}</Typography>
                    </Box>
                    <Box pl={3} mb={3} display={"flex"} flexDirection={"column"} color={"#00a859"}>
                      <Typography my={1} fontSize={14}>{plan.boxes}</Typography>
                      <Typography my={1} fontSize={14}>{plan.ads}</Typography>
                      <Typography my={1} fontSize={14}>{plan.commission}</Typography>
                      <Typography my={1} fontSize={14}>{plan.extra}</Typography>
                      <Typography my={1} fontSize={14}>{plan.year}</Typography>
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

                      onClick={() => handleSubscription(plan.key)}
                    >
                      {t("seller.business_plan.btn_select")}
                      {sellerIsLoading && <CircularProgress />}
                    </Button>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Box>
      </Card>
    </>
  );
};
export default BusinessPlan;
