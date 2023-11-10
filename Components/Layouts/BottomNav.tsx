import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import {
  FavoriteBorder,
  Home,
  Person,
} from "@mui/icons-material";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import {
  SyntheticEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/router";
import { useMediaQuery } from "@mui/material";
import ContextApi from "../../Store/context/ContextApi";
import { TCart } from "../../Helpers/Types";
import { useGetCart } from "../../hooks/useDataFetch";
import Badge from "@mui/material/Badge";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

let isFirst = false;
const MobileBottomNavigation: React.JSXElementConstructor<any> = () => {
  const { t } = useTranslation();
  const [value, setValue] = React.useState(0);
  const isMatches: boolean = useMediaQuery("(max-width : 250px)");
  const router = useRouter();
  const pathname = router.pathname;
  const isUserPath =
    pathname.includes("/account") || pathname.includes("/seller");
  const isLoggedIn = useContext(ContextApi).isLoggedIn;
  const handleRoute = useCallback(
    (url: string) => {
      if (isLoggedIn) {
        return router.push(url);
      }
      router.push("/login");
    },
    [isLoggedIn]
  );

  useEffect(() => {
    const pathname = router.pathname;
    if (pathname.includes("wishlist")) setValue(2);
    if (pathname.includes("cart")) setValue(1);
  }, [router]);
  const cartChange = useContext(ContextApi).cartChange;
  const [cartLength, setCartLength] = useState<number>(0);
  const onCartSuccess = (data: TCart) => {
    setCartLength(data?.products?.length);
  };
  const handleRefetchContext = useContext(ContextApi).handleRefetch;

  const { refetch } = useGetCart(onCartSuccess);
  useEffect(() => {
    const token: string = Cookies.get("token");
    // const token: string = localStorage.getItem("token");
    if (!token) return;
    handleRefetchContext();
    const timeout = setTimeout(() => {
      isFirst = true;
      refetch();
    }, 400);
    return () => clearTimeout(timeout);
  }, []);
  useEffect(() => {
    if (!isFirst) return;
    refetch();
  }, [cartChange]);

  useEffect(() => {
    if (!isLoggedIn) {
      setCartLength(0);
    }
  }, [isLoggedIn]);
  return (
    <Box sx={{ pb: 7 }}>
      <CssBaseline />
      <Paper
        sx={{
          position: "fixed",
          zIndex: "9999999",
          bottom: 0,
          left: 0,
          right: 0,
        }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={isUserPath ? 3 : value}
          onChange={(event: SyntheticEvent, newValue) => {
            setValue(newValue);
          }}
          sx={{
            "& .Mui-selected, .Mui-selected > svg ": {
              color: "#fff",
            },
            "& .Mui-selected, .Mui-selected > .badge ": {
              color: "#fff",
            },
          }}
        >
          {!isMatches && (
            <BottomNavigationAction
              onClick={() => router.push("/")}
              label={t("bottomNav.home")}
              icon={<Home fontSize={isMatches ? "small" : "medium"} />}
            />
          )}
          <BottomNavigationAction
            onClick={() => handleRoute("/cart")}
            label={t("bottomNav.cart")}
            icon={
              <Badge
                badgeContent={cartLength}
                color="error"
                className={"badge"}
              >
                <ShoppingBagIcon fontSize={isMatches ? "small" : "medium"} />{" "}
              </Badge>
            }
          />
          <BottomNavigationAction
            onClick={() => handleRoute("/wishlist")}
            label={t("bottomNav.wishlist")}
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            icon={<FavoriteBorder fontSize={isMatches ? "small" : "medium"} />}
          />
          <BottomNavigationAction
            onClick={() => handleRoute("/account")}
            label={t("bottomNav.account")}
            icon={<Person fontSize={isMatches ? "small" : "medium"} />}
          />
          {/*router.push('/account', '/account', {'locale': 'fr'})*/}
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default MobileBottomNavigation;
