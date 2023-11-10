import * as React from "react";
import Image from "next/image";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  FormControl,
  Select,
  SelectChangeEvent,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  AccountCircleOutlined,
  FavoriteBorder,
  NotificationsOutlined,
} from "@mui/icons-material";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import { useGetAllCategories, useGetCart } from "../../hooks/useDataFetch";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import ContextApi from "../../Store/context/ContextApi";
import { TCart } from "../../Helpers/Types";
import { useTranslation } from "react-i18next";
import Notification from "../Notification";
import { INotification, getAllNotifications } from "../../Store/Notification";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Store/Index";
import Popover from '@mui/material/Popover';
import { baseUrl } from "../../Helpers/baseUrl";
import axios from "axios";
import Cookies from "js-cookie";
import { categoryTags } from "../../Helpers/CategoryTags";

let isFirst = false;
type ICat = {
  title: string;
  _id: string;
};

interface INav {
  searchaValue?: String;
}
export default function Nav(props: INav) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const [anchorNotiEl, setAnchorNotiEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);
  const notifications = useSelector((state: RootState) => state.notification.notifications);
  const dispatch = useDispatch();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const { i18n, t } = useTranslation();

  const handleProfileMenuOpen = () => {
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      router.push("/account")
    }
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = (url: string) => {
    // router.push(url)
    setAnchorEl(null);
    handleMobileMenuClose();
  };
  const handleChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };
  const isLoggedIn = useContext(ContextApi).isLoggedIn;
  // console.log('islogi---------------------------------------------------------', isLoggedIn)
  const handleRoute = (url: string) => {
    if (isLoggedIn) {
      return router.push(url);
    }

    router.push("/login");
  };
  const [category, setCategory] = React.useState("All categories");
  const [inCategory, setInCategory] = React.useState([{ category: "All categories", tag: "" }]);
  const [showSearchBox, setShowSearchBox] = React.useState(false);

  const handleFollowRequest = (sellerId: string) => {
    if (isLoggedIn) {
    }

    router.push("/login");
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => router.push("/account")}>Account</MenuItem>
    </Menu>
  );
  const [search, setSearch] = useState<string>("");

  const [allCategories, setAllCategories] = useState<ICat[]>([]);
  const onSuccess = (data: ICat[]) => {
    setAllCategories(data);
  };
  useGetAllCategories(onSuccess);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    if (val && val !== "") {
      const temp = categoryTags.filter(c => {
        const checked = c.category.filter(tag => tag.includes(val))
        if (checked.length > 0) return true;
        return false;
      })

      if (temp.length > 0) {
        const t = [{ category: "All categories", tag: "" }];
        for (let i = 0; i < temp.length; i++) {
          if (i < 3) {
            const categoryList = temp[i].category
            const tags = categoryList.filter(tag => tag.toLocaleLowerCase().includes(val.toLocaleLowerCase()))
            t.push({ category: temp[i].key, tag: tags[0] })
          }
        }
        setInCategory(t)
        setShowSearchBox(true)
      } else {
        setInCategory([])
        setShowSearchBox(false)
      }
    } else {
      setShowSearchBox(false)
    }
  }, [search, allCategories]);

  const searchProducts = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      let id: string = "";
      if (category !== "All categories") {
        const newData = allCategories;
        const filteredData = newData.find((value) => value.title === category);
        id = filteredData!._id;
      }
      if (search.length === 0) return;
      setShowSearchBox(false)
      window.location.replace(`/search/${search + "&category=" + id + "&tag="}`);
    },
    [search, category]
  );

  const searchSuggestion = useCallback((type: string, item: any) => {
    let id: string = "";
    let tag: string = "";
    if (type == "category") {
      if (item.category !== "All categories") {
        const newData = allCategories;
        const filteredData = newData.find((value) => value.title === item.category);
        id = filteredData?._id;
      }
      if (search.length === 0) return;
    } else {
      tag = item.tag
    }
    setShowSearchBox(false)
    window.location.replace(`/search/${search + "&category=" + id + "&tag=" + tag}`);
  }, [search]);

  const handleLogouts = useContext(ContextApi).handleLogout;
  const handleLogout = () => {
    handleLogouts();
    Cookies.set("currentLanguage", i18n.language, { expires: 7, secure: true });
    // localStorage.setItem("currentLanguage", i18n.language);
    router.push("/login");
  };
  const cartChange = useContext(ContextApi).cartChange;
  const [cartLength, setCartLength] = useState<number>(0);
  const onCartSuccess = (data: TCart) => {
    setCartLength(data?.products?.length);
  };
  const handleRefetchContext = useContext(ContextApi).handleRefetch;
  const { refetch } = useGetCart(onCartSuccess);

  useEffect(() => {
    handleRefetchContext();
    const token = Cookies.get("token");
    // const token = localStorage.getItem("token");
    if (!token) return;
    const timeout = setTimeout(() => {
      isFirst = true;
      refetch();
    }, 400);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (props.searchaValue) {
      setSearch(`${props.searchaValue}`);
    }
  }, [props.searchaValue]);
  const handleRefetchCart = () => {
    refetch();
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoggedIn && isFirst) {
        refetch();
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [cartChange]);
  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton
          size="large"
          className={"navHover"}
          aria-label="show 17 new notifications"
          color="inherit"
        >
          {/*<Badge badgeContent={17} color="error">*/}
          {/*    <NotificationsIcon />*/}
          {/*</Badge>*/}
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );
  const matches: boolean = useMediaQuery("(max-width:180px)");
  const router = useRouter();

  const handleNotiClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isLoggedIn) {
      router.push('/login')
    } else {
      setAnchorNotiEl(event.currentTarget);
    }
  };
  const handleNotiClose = () => {
    setAnchorNotiEl(null);
  };

  const notiOpen = Boolean(anchorNotiEl);
  const id = notiOpen ? 'simple-popover' : undefined;
  /**
   * handling notifications here
   * newNotifications: notifications that is not read yet.
   *     The number of newNotifications will be show as the badge of notification icon
   * olderNotifications: notifications that is already read.
   */

  useEffect(() => {
    getNotifications();
  }, []);
  const getUserInfoFromCookies = () => {
    const userInfoData = Cookies.get('userInfo');
    if (userInfoData) {
      return JSON.parse(userInfoData);
    }
    return null;
  };
  const getNotifications = async () => {
    const userInfo = getUserInfoFromCookies();
    if (userInfo) {
      const adminToken = Cookies.get('adminToken')
      const token = Cookies.get('token')
      const config = {
        headers: {
          Authorization: token ?? adminToken
        }
      }
      try {
        const resp = await axios.get(`${baseUrl}/api/notification/${userInfo?.role}-${userInfo?.role === 'seller' ? userInfo?.sellerId : userInfo?._id}`, config)
        if (resp.data) {
          dispatch(getAllNotifications(resp.data))
        } else {
          dispatch(getAllNotifications([]))
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const [newNotifications, setNewNotifications] = useState<INotification[]>();
  const [olderNotifications, setOlderNotifications] = useState<INotification[]>();
  useEffect(() => {
    if (notifications?.length) {
      const tempNew = notifications?.filter((item) => !item.isRead);
      const tempOlder = notifications?.filter((item) => item.isRead);
      setNewNotifications(tempNew);
      setOlderNotifications(tempOlder);
    }
  }, [notifications]);


  return (
    <>
      <AppBar position="sticky" className={"nav"}>
        <Toolbar sx={{ px: { xs: 0, sm: 2 } }}>
          <IconButton
            size="small"
            edge="start"
            aria-label="open drawer"
            sx={{
              mr: {
                xs: 0,
                md: 2,
              },

              ml: {
                xs: 0,
                md: 2,
              },

              "&:hover": {
                backgroundColor: "transparent !important",
              },
            }}
            onClick={() => router.push("/")}
          >
            <Image
              width={70}
              height={50}
              src={"https://res.cloudinary.com/linconstore-cloud/image/upload/f_auto,q_auto/v1/web-asset/y91radan7dkpnwlicnws"}
              alt={"picture for icon"}
              placeholder="blur"
              blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
            />
          </IconButton>
          <Box sx={{ flexGrow: { sm: 0.4 } }} />
          {/* make a search box rounded */}
          <form onSubmit={searchProducts} className="search__bar__header">
            <FormControl
              className={"category__select"}
              sx={{
                margin: 0,
                border: "none",
                m: 1,
                minWidth: { xs: 140, sm: 140, md: 135, lg: 115 },
                display: "block" /* Set the default display to block */,
                "@media (max-width: 500px)": {
                  display: "none" /* Hide on mobile devices */,
                },
              }}
              size="medium"
            >
              <Select
                className={"select"}
                labelId="demo-select-small"
                id="demo-select-small"
                value={category}
                sx={{
                  border: "0px",
                  margin: "0px",
                  p: 0,
                  "& fieldset": {
                    border: "none !important",
                    outline: "none !important",
                  },
                  "& .MuiSelect-outlined": {
                    p: 0,
                  }
                }}
                variant={"outlined"}
                onChange={handleChange}
              >
                <MenuItem value="All categories">
                  <Typography mt={0.3} variant={"body2"}>
                    {t("category.all_categories")}
                  </Typography>
                </MenuItem>
                {allCategories?.length > 0 &&
                  allCategories.map((category, index) => (
                    <MenuItem key={index} value={category.title}>
                      {t(`maincategory.${category.title}`)}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <div className="search_bar_input">
              <input
                value={search}
                onChange={handleSearch}
                type="text"
                placeholder={t("nav.search_title")}
              />
              {showSearchBox &&
                <div className="search_bar_input_select">
                  {inCategory.map((item, index) => {
                    return (
                      <p onClick={() => searchSuggestion("category", item)} key={index}>{search} in {t(`maincategory.${item.category}`)}</p>
                    )
                  })}
                </div>
              }
            </div>
            <IconButton type={"submit"} className={"searchIcon"}>
              <SearchIcon />
            </IconButton>
          </form>
          <Box sx={{ marginLeft: "1px", display: { xs: "none", md: "flex" } }}>
            {isLoggedIn && (
              <Button
                className={"auth__btn"}
                onClick={() => handleLogout()}
                sx={{
                  mt: 0.5,
                  width: "100%",
                  background: "transparent",
                  height: "100%",
                  whiteSpace: "nowrap",

                  color: "#FFF",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  mx: 1,
                }}
              >
                {t("nav.logout")}
              </Button>
            )}
            {!isLoggedIn && (
              <Button
                className={"auth__btn"}
                onClick={() => router.push("/login")}
                sx={{
                  // mt: 0.5,
                  width: "100%",
                  height: "100%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  background: "transparent",
                  fontSize: "12px",
                  color: "#fff",
                  textTransform: "normal",
                  padding: "10px 30px",
                  borderRadius: "10px",
                  // mx: 1,
                }}
              >
                {t("nav.signIn")}
              </Button>
            )}
          </Box>
          <Box sx={{ flexGrow: { md: 0.05 } }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Box sx={{ display: "flex", flexDirection: "row", ml: 9 }}>
              <IconButton
                size="large"
                aria-label="Your shopping cart"
                color="inherit"
                sx={{ color: "#07a759", padding: "8px" }}
                onClick={() => handleRoute("/cart")}
              >
                <Badge badgeContent={cartLength} color="error">
                  <ShoppingBagOutlinedIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                aria-label="Your shopping cart"
                color="inherit"
                sx={{ color: "#07a759", padding: "8px" }}
                onClick={() => handleRoute("/wishlist")}
              >
                <FavoriteBorder />
              </IconButton>
              <Box position="relative">
                <IconButton
                  className={"navHover"}
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit"
                  sx={{ color: "#07a759", height: "100%", padding: "8px" }}
                  onClick={handleNotiClick}
                >
                  <Badge badgeContent={newNotifications?.length} color="error">
                    <NotificationsOutlined />
                  </Badge>
                </IconButton>
                <Popover
                  id={id}
                  open={notiOpen}
                  anchorEl={anchorNotiEl}
                  onClose={handleNotiClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  <Notification
                    newNotifications={newNotifications}
                    olderNotifications={olderNotifications}
                  />
                </Popover>
              </Box>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                sx={{ color: "#ffffff", padding: "8px" }}
              >
                <AccountCircleOutlined className="icon-green" />
              </IconButton>
            </Box>
          </Box>
          {!matches && (
            <Box
              sx={{
                display: { ml: 2, xs: "flex", md: "none" },
                ml: {
                  xs: 0,
                  md: 2,
                },
              }}
            >
              <Box position="relative">
                <IconButton
                  className={"navHover"}
                  size="small"
                  aria-label="show 17 new notifications"
                  color="inherit"
                  sx={{ color: "black" }}
                  onClick={handleNotiClick}
                >
                  <Badge badgeContent={newNotifications?.length} color="error">
                    <NotificationsIcon className="icon-green" />
                  </Badge>
                </IconButton>

                <Popover
                  id={id}
                  open={notiOpen}
                  anchorEl={anchorNotiEl}
                  onClose={handleNotiClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  <Notification
                    newNotifications={newNotifications}
                    olderNotifications={olderNotifications}
                  />
                </Popover>
              </Box>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {/* {renderMenu} */}
    </>
  );
}
