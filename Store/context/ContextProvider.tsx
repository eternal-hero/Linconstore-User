import ContextApi from "./ContextApi";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteToken } from "../Auth";
import Cookies from "js-cookie";
type IAuth = {
  auth: {
    isLoggedIn: boolean;
    token: string;
    adminToken: string;
  };
};
interface BaseLayoutProps {
  children?: ReactNode;
}
// const key = "c80ae48d-1edf-45fd-8914-f50f0567b7d9";

const ContextProvider: React.FC<BaseLayoutProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [rate, setRate] = useState<Record<string, number>>({});
  const isLoggedIN = useSelector((state: IAuth) => state.auth.token);
  const isAdminLoggedIN = useSelector((state: IAuth) => state.auth.adminToken);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [config, setConfig] = useState({});
  const [isSeller, setIsSeller] = useState<boolean>(false);
  const [adminConfig, setAdminConfig] = useState({});
  const [following, setFollowing] = useState([]);
  const [name, setName] = useState<string>("");
  const [isLogging, setIsLogging] = useState<boolean>(false);
  const [sellerId, setSellerId] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [storeScrollPos, setStoreScrollPos] = useState<number>(0);
  const [isRefetch, setIsRefetch] = useState<boolean>(false);
  const [sellerIsActive, setSellerIsActive] = useState<boolean>(true);
  const [adminRate, setAdminRate] = useState<number>(0);
  useEffect(() => {
    // const isLoggedIn = localStorage.getItem("token");
    // const userFollowing = localStorage.getItem("usf");
    const isLoggedIn = Cookies.get("token");
    const userFollowing = Cookies.get("usf");
    if (!!isLoggedIn || isLoggedIN) {
      setIsLoggedIn(true);
      const token = encodeURI(isLoggedIn || isLoggedIN);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      setConfig(config);

      setFollowing(JSON.parse(userFollowing));
    } else {
      setIsLoggedIn(false);
    }
  }, [isLoggedIN, isLogging, isRefetch]);
  useEffect(() => {
    // const isAdminLogin = localStorage.getItem("adminToken");
    const isAdminLogin = Cookies.get("adminToken");
    if (!!isAdminLogin || isAdminLoggedIN) {
      setIsAdminLoggedIn(true);
      const token = encodeURI(isAdminLogin || isAdminLoggedIN);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      setAdminConfig(config);
    } else {
      setIsAdminLoggedIn(false);
    }
  }, [isAdminLoggedIN, isLogging]);
  const isUserLoggedIn = useCallback(() => {
    return isLoggedIn;
  }, [isLoggedIN]);
  const dispatch = useDispatch();
  const handleIsSeller = () => setIsSeller(true);
  const handleIsNotSeller = () => setIsSeller(false);
  const handleAdminRate = (rate: number) => {
    setAdminRate(rate);
  };
  const handleStorePos = (pos: number) => {
    setStoreScrollPos(pos);
  };

  const handleSellerActive = (active: boolean) => {
    setSellerIsActive(active);
  };

  const handleLogout = () => {
    // alert('loggout!!!!!!')
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('status');
    localStorage.removeItem('storeId')
    localStorage.removeItem('completed');
    const allCookieNames = Object.keys(Cookies.get());

    // Loop through the array and remove each cookie
    allCookieNames.forEach((cookieName) => {
      if(cookieName != "country") {
        Cookies.remove(cookieName);
      }
    });
    dispatch(deleteToken());
    setIsLoggedIn(false);
  };

  const handleRefetch = () => {
    setIsRefetch((prev) => !prev);
  };

  const handleSetFollowing = (following: Array<string>) => {
    setFollowing(following);
  };
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [ratingId, setRatingId] = useState<string>("");
  const handleRatingId = (id: string) => {
    setRatingId(id);
  };
  const clearRatingId = () => {
    setRatingId("");
  };
  const handleRateChange = async (data: Record<string, number>) => {
    setRate(data);
  };

  const onAdminLogin = () => {
    setIsLoggedIn((prevState) => !prevState);
  };
  const handleUpdateCart = () => {
    setIsUpdating((prevState) => !prevState);
  };
  const [cartChange, setCartChange] = useState<boolean>(false);

  const handleCartChange = () => {
    setCartChange((prevState) => !prevState);
  };
  const handleUpdateSellerId = (id: string) => {
    setSellerId(id);
  };
  const handleRole = (role: string) => setRole(role);
  const handleName = (name: string) => setName(name);
  const context = {
    isUserLoggedIn,
    isLoggedIn,
    handleRole,
    handleRateChange,
    handleName,
    handleLogout,
    handleIsSeller,
    isSeller,
    onAdminLogin,
    handleIsNotSeller,
    isAdminLoggedIn,
    name,
    adminRate,
    handleAdminRate,
    rate,
    handleRefetch,
    handleSetFollowing,
    following,
    role,
    adminConfig,
    config,
    handleRatingId,
    sellerIsActive,
    handleSellerActive,
    clearRatingId,
    storeScrollPos,
    ratingId,
    isUpdating,
    handleUpdateCart,
    cartChange,
    sellerId,
    handleUpdateSellerId,
    handleStorePos,
    handleCartChange,
  };
  return <ContextApi.Provider value={context}>{children}</ContextApi.Provider>;
};
export default ContextProvider;
