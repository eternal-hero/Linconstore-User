import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import ListWrapper from "../Wappers/ListWrapper";
import { Grid, useMediaQuery } from "@mui/material";
import Footer from "../Layouts/Footer";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import Nav from "../Layouts/Nav";
import { useContext, useEffect, useState } from "react";
import ContextApi from "../../Store/context/ContextApi";
import { useGetStore, useGetUser } from "../../hooks/useDataFetch";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

export default function UserSettings() {
  const { t } = useTranslation();

  type manage = {
    title: string;
    link: string;
  };

  const accountItems: manage[] = [
    {
      title: t("account.setting.AccItem1"),
      link: "/account/security",
    },
    {
      title: t("account.setting.AccItem2"),
      link: "/account/contact",
    },
    // {
    //     title: 'Manage  devices',
    //     link: '/account/manage'
    // },
    // {
    //     title: 'Wallets',
    //     link: '/account/wallets'
    // },
  ];
  const manageStore: manage[] = [
    {
      title: t("account.manageStore.Item1"),
      link: "/seller",
    },
    {
      title: t("account.manageStore.Item2"),
      link: "seller/orderplaced",
    },
    {
      title: t("account.manageStore.Item3"),
      link: "seller/orderprocessed",
    },
    {
      title: t("account.manageStore.Item4"),
      link: "seller/ordershipped",
    },
    {
      title: t("account.manageStore.Item5"),
      link: "seller/stats",
    },
    {
      title: t("account.manageStore.Item6"),
      link: "seller/ads",
    },
    {
      title: t("account.manageStore.Item7"),
      link: "seller/business",
    },
    {
      title: t("account.manageStore.Item8"),
      link: "seller/modify",
    },
    {
      title: t("account.manageStore.Item9"),
      link: "seller/post",
    },
    {
      title: t("account.manageStore.Item10"),
      link: "seller/expenses",
    },
    {
      title: t("account.manageStore.Item11"),
      link: "seller/messages",
    },
    {
      title: t("account.manageStore.Item12"),
      link: "seller/refund",
    },
  ];
  const ordersItem: manage[] = [
    {
      title: t("account.ordersItem.Item1"),
      link: "/account/placedorders",
    },
    {
      title: t("account.ordersItem.Item2"),
      link: "/account/orderprocessed",
    },
    {
      title: t("account.ordersItem.Item3"),
      link: "/account/pastorders",
    },
  ];
  const personalizedInfo: manage[] = [
    {
      title: t("account.personalizedInfo.Item1"),
      link: "/account/deals",
    },
    // {
    //     title: 'Browsing History',
    //     link: '/account/history'
    // },
    // {
    //     title: 'Your Recommendations',
    //     link: '/account/recommendation'
    // },
  ];
  const myStore: manage[] = [
    {
      title: t("account.myStore.Item1"),
      link: "/seller",
    },
  ];
  const close: manage[] = [
    {
      title: t("account.close.Item1"),
      link: "/account/closeaccount",
    },
  ];
  const noClose: manage[] = [
    {
      title: t("account.close.Item1"),
      link: "/account/noClose",
    },
  ];
  const ads : manage[]  = [
      {
          title: t("account.preference.title"),
          link: '/account/preference'
      },
  ]
  const message: manage[] = [
    {
      title: t("account.message.Item1"),
      link: "/account/messages",
    },
  ];
  const isMobile: boolean = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const myRole: string = useContext(ContextApi).role;
  const [role, setRole] = useState<string>();
  const name = useContext(ContextApi).name;
  const isLoggedIn = useContext(ContextApi).isLoggedIn;
  const handleRefetch = useContext(ContextApi).handleRefetch;
  const { data, refetch: refetchUser } = useGetUser();
  useEffect(() => {
    // const token = localStorage.getItem("token");
    const token = Cookies.get("token");
    if (!token) router.push("/login");
    handleRefetch();
    const timeout = setTimeout(() => {
      refetchUser();
    }, 300);

    return () => clearTimeout(timeout);
  }, []);
  const [firstName, setFirstName] = useState(name);
  const handleLogouts = useContext(ContextApi).handleLogout;
  const handleLogout = () => {
    handleLogouts();
    router.push("/login");
  };
  // const onSuccess = () => {
  //   setRole("seller");
  // };
  // const { refetch } = useGetStore(onSuccess);
  useEffect(() => {
    // const role = localStorage.getItem("role");
    const role = Cookies.get("role");
    if (role === "seller") setRole("seller");
  }, []);

  return (
    <>
      <Nav />
      <Container component={"main"} maxWidth={"xl"} sx={{ minHeight: "calc(100vh - 315px)"}}>
        <CssBaseline />
        <Typography variant={"h5"} sx={{ mt: 1, textAlign: "center", fontSize: 15 }}>
          {t("account.welcome_content")},{" "}
          {firstName ? firstName : data?.firstName}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContents: "center",
          }}
        >
          <Grid container spacing={isMobile ? 0 : 4}>
            <Grid item xs={12} sm={6} md={4}>
              <ListWrapper
                title={t("account.AccountSettings")}
                menuItem={accountItems}
              />
            </Grid>
            {isMobile && (
              <Button
                className={"myButton"}
                color={"inherit"}
                onClick={handleLogout}
                variant={"outlined"}
                sx={{
                  mt: 0.5,
                  width: "100px",
                  background: "transparent",
                  height: "40px",
                  border: "0px !important",
                  color: "#000 !important",
                  textTransform: "none",
                }}
              >
                {t("account.btnLogout")}
              </Button>
            )}
            <Grid item xs={12} sm={6} md={4}>
              <ListWrapper title={t("account.Orders")} menuItem={ordersItem} />
            </Grid>
            {/* <Grid item xs={12} sm={6} md={4}>
                            <ListWrapper title={'Personalized Info'} menuItem={personalizedInfo}  />
                        </Grid> */}
            {isMobile && role === "seller" && (
              <Grid item xs={12} sm={6} md={4}>
                <ListWrapper
                  title={t("account.ManageYourStore")}
                  menuItem={manageStore}
                />
              </Grid>
            )}
            {!isMobile && role === "seller" && (
              <Grid item xs={12} sm={6} md={4}>
                <ListWrapper
                  title={t("account.ManageYourStore")}
                  menuItem={myStore}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6} md={4}>
              <ListWrapper
                title={t("account.MessageCenter")}
                menuItem={message}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
               <ListWrapper title={t("account.AppPreferences")} menuItem={ads}/>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              {
                role !== "seller" && (
                  <ListWrapper title={t("account.DataPrivacy")} menuItem={close} />
                )
              }
              {
                role === "seller" && (
                  <ListWrapper title={t("account.DataPrivacy")} menuItem={noClose} />
                )
              }
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Footer />
    </>
  );
}
