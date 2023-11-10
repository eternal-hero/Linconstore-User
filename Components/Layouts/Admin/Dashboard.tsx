import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Head from "next/head";
import { useRouter } from "next/router";
import GenNav from "../GenNav";
import { useMediaQuery } from "@mui/material";
import { useEffect } from "react";
import Cookies from "js-cookie";
import {
  Insights,
  Inbox,
  CurrencyExchange,
  Storefront,
  Groups,
  AdminPanelSettings,
  Stars,
  Chat,
  RssFeed,
  PublishedWithChanges,
  SettingsBackupRestore,
  Flag,
  StackedLineChart,
  CallSplit,
  StickyNote2,
} from '@mui/icons-material';
import { useTranslation } from "react-i18next";

const drawerWidth: number = 240;

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

function DashboardContent({ children }: any) {
  const router = useRouter();
  const isMatches = useMediaQuery("(max-width: 800px)");
  const isMobile = useMediaQuery("(max-width : 600px)");
  useEffect(() => {
    // const token = localStorage.getItem("adminToken");
    const token = Cookies.get("adminToken");
    if (!token) {
      router.back();
    }
  }, []);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          maxHeight: "100vh !important",
          overflowY: "hidden",
        }}
      >
        <GenNav mode={false} admin={true} />
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
                    sx={{display: "flex", gap: 2}}
                  >
                    {item.icon}
                    <ListItemText primary={item.text} sx={{"& span": {fontSize: 14}}} />
                  </ListItemButton>
                ))}
              </List>
            </Drawer>
          )}
          <Box
            component="main"
            sx={{
              py: 1,
              flexGrow: 1,
              height: "96.3vh",
              overflow: "auto",
              bgcolor: "rgba(11, 166, 89, 0.08)"
            }}
          >
            <Container maxWidth="xl" sx={{ mb: 2 }}>
              {children}
            </Container>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default function Dashboard({ children }: any) {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>Linconstore </title>
        <meta name="Welcome to my store" content="Jack Store" />
        {/*<link rel="icon" href="/favicon.png" />*/}
      </Head>
      <DashboardContent> {children} </DashboardContent>
    </>
  );
}

export const menuItems = [
  {
    text: "Analytics",
    path: "/admin",
    icon: <Insights sx={{color: "var(--primary)"}} />,
  },
  {
    text: "Products",
    path: "/admin/products",
    
    icon: <Inbox sx={{color: "var(--primary)"}} />,
  },
  {
    text: "Store Payout",
    path: "/admin/store",
    
    icon: <CurrencyExchange sx={{color: "var(--primary)"}} />,
  },
  {
    text: "Sellers",
    path: "/admin/sellers",
    
    icon: <Storefront sx={{color: "var(--primary)"}} />,
  },
  {
    text: "Users",
    path: "/admin/users",
    
    icon: <Groups sx={{color: "var(--primary)"}} />,
  },
  {
    text: "Admins",
    path: "/admin/admins",
    
    icon: <AdminPanelSettings sx={{color: "var(--primary)"}} />,
  },
  {
    text: "Ratings ",
    path: "/admin/ratings",
    
    icon: <Stars sx={{color: "var(--primary)"}} />,
  },
  {
    text: "Messages ",
    path: "/admin/messages",
    
    icon: <Chat sx={{color: "var(--primary)"}} />,
  },
  {
    text: "Feedback ",
    path: "/admin/feedback",
    
    icon: <RssFeed sx={{color: "var(--primary)"}} />,
  },
  {
    text: "Verification",
    path: "/admin/verification",
    
    icon: <PublishedWithChanges sx={{color: "var(--primary)"}} />,
  },
  {
    text: "Refund request",
    path: "/admin/refund",
    
    icon: <SettingsBackupRestore sx={{color: "var(--primary)"}} />,
  },
  {
    text: "Report",
    path: "/admin/report",    
    icon: <Flag sx={{color: "var(--primary)"}} />,
  },
  {
    text: "Orders",
    path: "/admin/orders",    
    icon: <StackedLineChart sx={{color: "var(--primary)"}} />,
  },
  {
    text: "Transaction",
    path: "/admin/transaction",    
    icon: <CallSplit sx={{color: "var(--primary)"}} />,
  },
  {
    text: "Ticket",
    path: "/admin/ticket",    
    icon: <StickyNote2 sx={{color: "var(--primary)"}} />,
  },
];
