import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Badge from "@mui/material/Badge";
import { useRouter } from "next/router";
import GenNav from "../GenNav";
import { ListItemIcon, useMediaQuery } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import ContextApi from "../../../Store/context/ContextApi";
import { useGetSellerInfo, useGetStore } from "../../../hooks/useDataFetch";
import { handleRateChange } from "../../../Helpers/Exchange";
import { useDispatch, useSelector } from "react-redux";
import { saveSellerRate } from "../../../Store/Utils";
import { saveCurrency } from "../../../Store/Currency";
import { useTranslation } from "react-i18next";
import { INotification } from "../../../Store/Notification";
import { RootState } from "../../../Store/Index";
import {
  Storefront,
  AllInbox,
  Archive,
  LocalShipping,
  Analytics,
  Payments,
  SettingsSuggest,
  Inventory2,
  ReceiptLong,
  Message,
  Restore,
  MultilineChart
} from '@mui/icons-material';

const drawerWidth: number = 240;

interface IStore {
  currency: string;
}
type TSeller = {
  isActive: boolean;
  isVerified: boolean;
  _id: string;
};

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));
export const currencies: { value: string; label: string }[] = [
  { value: "EUR", label: "€" },
  { value: "AUD", label: "$" },
  { value: "BGN", label: "лв" },
  { value: "CAD", label: "$" },
  { value: "HRK", label: "kn" },
  { value: "CZK", label: "Kč" },
  { value: "DKK", label: "kr" },
  { value: "HUF", label: "Ft" },
  { value: "NOK", label: "kr" },
  { value: "PLN", label: "zł" },
  { value: "NZD", label: "$" },
  { value: "MXN", label: "$" },
  { value: "Pounds", label: "£" },
  { value: "SEK", label: "kr" },
  { value: "CHF", label: "Fr" },
  { value: "USD", label: "$" },
];
function DashboardContent({ children }: any) {
  const { t } = useTranslation();

  const menuItems = [
    {
      text: t("seller.menuItem.home"),
      icon: <Storefront />,
      path: "/seller",
    },
    {
      text: t("seller.menuItem.orders_placed"),
      icon: <AllInbox />,
      path: "/seller/orderplaced",
    },
    {
      text: t("seller.menuItem.orders_processed"),
      icon: <LocalShipping />,
      path: "/seller/orderprocessed",
    },
    {
      text: t("seller.menuItem.orders_shipped"),
      icon: <Archive />,
      path: "/seller/ordershipped",
    },
    {
      text: t("seller.menuItem.store_statistics"),
      icon: <Analytics />,
      path: "/seller/stats",
    },
    {
      text: t("seller.menuItem.manage_ads"),
      icon: <MultilineChart />,
      path: "/seller/ads",
    },
    {
      text: t("seller.menuItem.business_plan"),
      icon: <Payments />,
      path: "/seller/business",
    },
    {
      text: t("seller.menuItem.modify_Store"),
      icon: <SettingsSuggest />,
      path: "/seller/modify",
    },
    {
      text: t("seller.menuItem.add_product"),
      icon: <Inventory2 />,
      path: "/seller/post",
    },
    {
      text: t("seller.menuItem.store_expense"),
      icon: <ReceiptLong />,
      path: "/seller/expenses",
    },
    {
      text: t("seller.menuItem.messages"),
      icon: <Message />,
      path: "/seller/messages",
    },
    {
      text: t("seller.menuItem.refund_request"),
      icon: <Restore />,
      path: "/seller/refund",
    },
  ];
  const dispatch = useDispatch();
  const router = useRouter();
  const onSuccess = async (data: IStore) => {
    const currency = currencies.find((x) => x.value === data.currency);
    dispatch(saveCurrency({ currency: currency.label }));
    const response: number = await handleRateChange(data.currency);
    dispatch(saveSellerRate({ sellerRate: response }));
    localStorage.setItem("sellerRate", String(response));
  };
  const { data, refetch } = useGetStore(onSuccess);
  const handleSellerActive = useContext(ContextApi).handleSellerActive;
  const onSellerInfoSuccess = (data: TSeller) => {
    if (data.isVerified) {
      handleSellerActive(data.isActive);
    } else {
      router.push("/seller/permission");
    }
  };
  const {
    refetch: refetchSellerInfo,
    isError,
    error,
  } = useGetSellerInfo(onSellerInfoSuccess);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    const clearMe = setTimeout(() => {
      refetch();
      refetchSellerInfo();
    }, 2000);

    return () => clearTimeout(clearMe);
  }, []);
  useEffect(() => {
    if (isError) {
      if (error.response) {
        const statusCode = error.response.status;
        if (statusCode === 401) {
          router.push("/");
        }
      }
    }
  }, [isError]);
  const isMatches = useMediaQuery("(max-width: 800px)");
  const isMobile = useMediaQuery("(max-width : 600px)");
  const verifySeller = useContext(ContextApi).isUserLoggedIn;

  const notifications = useSelector((state: RootState) => state.notification.notifications);
  const [newNotifications, setNewNotifications] = useState<INotification[]>();
  useEffect(() => {
    if (notifications?.length) {
      const tempNew = notifications?.filter((item: any) => !item.isRead && !item.sellerId);
      setNewNotifications(tempNew);
    }
  }, [notifications]);

  return (
    isClient ? <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        maxHeight: "100vh !important",
        overflowY: "hidden",
      }}
    >
      <GenNav admin={false} mode={true} />
      <Box sx={{ display: "flex" }}>
        {!isMobile && (
          <Drawer variant="permanent" open={!isMatches}>
            <Divider />
            <List component="nav">
              {menuItems.map((item, index) => (
                <ListItemButton
                  onClick={() => router.push(item.path)}
                  selected={router.pathname === item.path}
                  key={index}
                  sx={{
                    '&.MuiButtonBase-root.Mui-selected': {
                      color: "#00a859",
                    },
                    '& span': {
                      fontSize: 14,
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: "#00a859" }}>{item.icon}</ListItemIcon>
                  {item.path == "/seller/messages" ?
                    <Badge badgeContent={newNotifications?.length} color="error">
                      <ListItemText primary={item.text} />
                    </Badge> :
                    <ListItemText primary={item.text} />
                  }
                </ListItemButton>
              ))}
            </List>
          </Drawer>
        )}
        <Box
          component="main"
          className="dashboard"
          sx={{
            flexGrow: 1,
            height: "96.3vh",
            overflow: "auto",
            bgcolor: "rgba(11, 166, 89, 0.08)"
          }}
        >
          <Container
            maxWidth="xl"
            sx={{ mb: 3, p: 1 }}
          >
            {/* {router.pathname == "/seller/modify" && (
              data ? <>
                    <StoreHeader
                        title={data?.name}
                        logo={data?.logo}
                        summary={data?.summary}
                        location={data?.location}
                        createdAt={data?.createdAt}
                    />
                  </>
                    :
                  <CircularProgress/>

            )} */}
            {children}
          </Container>
        </Box>
      </Box>
    </Box> : <></>
  );
}

export default function Dashboard({ children }: any) {
  return (
    <>
      {/* <Head>
        <title>Orders | Seller's Dashboard Linconstore</title>
        <meta name="Welcome to my store" content="Jack Store" />
      </Head> */}
      <DashboardContent> {children} </DashboardContent>
    </>
  );
}
