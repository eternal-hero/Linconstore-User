import "../styles/globals.css";
import type { AppProps } from "next/app";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import Store from "../Store/Index";
import MobileBottomNavigation from "../Components/Layouts/BottomNav";
import { useMediaQuery } from "@mui/material";
import MainModal from "../Components/Utils/Modal";
import EditModal from "../Components/Utils/EditModal";
import Notify from "../Components/Utils/SnackBar";
import RequestModal from "../Components/Utils/Admin/RequestModal";
import AddAdminModal from "../Components/Utils/Admin/AddAdminModal";
import RatingModal from "../Components/Utils/User/RatingModal";
import DeleteModal from "../Components/Utils/Admin/DeleteModal";
import "nprogress/nprogress.css";
import NProgress from "nprogress";
import React from "react";
import Router from "next/router";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import ContextProvider from "../Store/context/ContextProvider";
import TermModal from "../Components/Utils/Seller/TermModal";
// import DeleteSeller from "../Components/Utils/Admin/DeleteSeller";fz
import PayoutModal from "../Components/Utils/Admin/PayoutModal";
import { Analytics } from "@vercel/analytics/react";
import "../config/i18n";
import ContextApi from "../Store/context/ContextApi";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import SEO from "../next-seo.config";
import { DefaultSeo } from "next-seo";
import { useAutoLogout } from "../hooks/useAutoLogout";
import { useInitialRates } from "../hooks/useInitialRates";
import SellerPayoutModal from "../Components/Utils/Seller/SellerPayoutModal";
import InitSocket from "../Components/Utils/InitSocket";
import ConsentBanner from "../Components/ConsentCookies/ConsentCookies";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { locale } = router;
  const { i18n } = useTranslation();

  const [isClient, setIsClient] = React.useState(false);
  const customTheme = createTheme({
    typography: {
      fontFamily: "Arial",
      fontWeightBold: 700,
      fontWeightLight: 400,
      fontWeightRegular: 500,
      fontWeightMedium: 600,
    },
    palette: {
      primary: {
        main: "#0ba659",
      },
    },
    components: {
      MuiCircularProgress: {
        defaultProps: {
          size: "1.2rem",
        },
      },
    },
  });
  const client = new QueryClient();
  const isMobile = useMediaQuery("(max-width: 600px)");

  React.useEffect(() => {
    const handleRouteStart = () => NProgress.start();
    const handleRouteDone = () => NProgress.done();
    //add the event handler on mount
    Router.events.on("routeChangeStart", handleRouteStart);
    Router.events.on("routeChangeComplete", handleRouteDone);
    Router.events.on("routeChangeError", handleRouteDone);
    return () => {
      // remove the event handler on unmount!
      Router.events.off("routeChangeStart", handleRouteStart);
      Router.events.off("routeChangeComplete", handleRouteDone);
      Router.events.off("routeChangeError", handleRouteDone);
    };
  }, []);

  React.useEffect(() => {
    setIsClient(true);
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("/sw.js").then(
          function (registration) {
          },
          function (err) {
          }
        );
      });
    }
  }, []);

  React.useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale]);

  useAutoLogout();
  // useInitialRates();

  return isClient ? (
    <Provider store={Store}>
      <ContextProvider>
        <QueryClientProvider client={client}>
          <ThemeProvider theme={customTheme}>
            <DefaultSeo {...SEO} />
            <MainModal />
            <ConsentBanner />
            <Notify />
            <EditModal />
            <DeleteModal />
            <PayoutModal />
            <InitSocket />
            {/*<DeleteSeller/>*/}
            <RequestModal />
            <Analytics />
            <AddAdminModal />
            <TermModal />
            <RatingModal />
            <SellerPayoutModal />
            <Component {...pageProps} />
            {isMobile && <MobileBottomNavigation />}
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        </QueryClientProvider>
      </ContextProvider>
    </Provider>
  ) : (
    <></>
  );
}

export default MyApp;
