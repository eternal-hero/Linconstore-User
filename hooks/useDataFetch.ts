import axios, { AxiosResponse } from "axios";
import { useMutation, useQuery } from "react-query";
import { useContext } from "react";
import ContextApi from "../Store/context/ContextApi";
import { baseUrl } from "../Helpers/baseUrl";
import { contactUsDefaultValue, contactReplyDefaultValue } from "../Helpers/Types";
import { useSelector } from "react-redux";
import {
  IChatRoom,
  insertNewChatRoom,
  removeDuplications,
} from "../Store/ChatRoom";
import { apiCall } from "../utils/axios";
import Cookies from "js-cookie";
export const useRegister = (onSuccess: any) => {
  const signUpHandler = async (data: object) => {
    const response = await axios.post(`${baseUrl}/user`, data);
    return response.data;
  };
  return useMutation(signUpHandler, {
    onSuccess,
    onError: async (data: any) => {
      return data;
    },
  });
};

export const useResendOtp = (onSuccess: any) => {
  const sendOtp = async (data: object) => {
    const response = await axios.post(`${baseUrl}/user/resend`, data);
    return response;
  };

  return useMutation(sendOtp, { onSuccess });
};

export const useUpdateStore = (onSuccess: any) => {
  const updateStore = async (data: object) => {
    const response = await apiCall({
      method: "PUT",
      route: "/seller/store",
      body: data,
    });
    return response;
  };

  return useMutation(updateStore, { onSuccess });
};

export const useVerifySignup = (onSuccess: any) => {
  const verifyUser = async (data: object) => {
    const response = await axios.post(`${baseUrl}/user/verify`, data);
    return response.data;
  };
  return useMutation(verifyUser, {
    onSuccess,
    onError: async (data: any) => {
      return data;
    },
  });
};
export const useLoginUser = (onSuccess: any) => {
  const loginHandler = async (data: object) => {
    const response = await axios.post(`${baseUrl}/user/login`, data);
    return response.data;
  };
  return useMutation(loginHandler, {
    onSuccess,
    onError: async (data: any) => {
      return data;
    },
  });
};
export const useResetPassword = (onSuccess: any) => {
  const resetHandler = async (data: object) => {
    const response = await axios.post(`${baseUrl}/user/reset`, data);
    return response.data;
  };
  return useMutation(resetHandler, {
    onSuccess,
    onError: async (data: any) => {
      return data;
    },
  });
};
export const useConfirmPassword = (onSuccess: any) => {
  const confirmPasswordHandler = async (data: object) => {
    const response = await axios.post(`${baseUrl}/user/password`, data);
    return response.data;
  };
  return useMutation(confirmPasswordHandler, {
    onSuccess,
    onError: async (data: any) => data,
  });
};
export const useGetAllCategories = (onSuccess: any) => {
  const getCategoriesHandler = async () => {
    const response = await axios.get(`${baseUrl}/categories`);
    return response.data;
  };
  return useQuery("allcategories", getCategoriesHandler, { onSuccess });
};

export const useGetSellerFunds = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const getSellerFunds = async () => {
    const response = await axios.get(`${baseUrl}/seller/funds`, config);
    return response.data;
  };
  return useQuery("sellerFunds", getSellerFunds, { onSuccess });
};
export const useGetTopCategories = (onSuccess: any) => {
  const getTopCategories = async () => {
    const response = await axios.get(`${baseUrl}/topcategory`);
    return response.data;
  };
  return useQuery("topcategories", getTopCategories, { onSuccess });
};

export const useRegisterSeller = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const registerSellerHandler = async (data: object) => {
    const response = await axios.post(`${baseUrl}/seller`, data, config);
    return response.data;
  };
  return useMutation(registerSellerHandler, {
    onSuccess,
    onError: async (error: any) => error,
  });
};
export const useHandleSellerSub = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handlerSellerSub = async (data: object) => {
    const response = await axios.post(
      `${baseUrl}/seller/subscribe`,
      data,
      config
    );
    return response.data;
  };
  return useMutation(handlerSellerSub, {
    onSuccess,
    onError: (error: any) => error,
  });
};
export const useVerifyPayment = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleVerifyPayment = async (data: object) => {
    const response = await axios.post(`${baseUrl}/seller/verify`, data, config);
    return response.data;
  };
  return useMutation(handleVerifyPayment, {
    onSuccess,
    onError: (error: any) => error,
  });
};
export const useGetStoreInfo = () => {
  const config = useContext(ContextApi).config;
  const handleGetStoreInfo = async () => {
    const response = await axios.get(`${baseUrl}/seller/store`, config);
    return response.data;
  };
  return useQuery("getStoreInfo", handleGetStoreInfo);
};

export const useGetUserStore = (onSuccess: any) => {
  const handleGetUserStore = async () => {
    const response = await apiCall({ route: "/seller/store" });
    return response.data;
  };

  return useQuery("getUserStore", handleGetUserStore, {
    onSuccess,
  });
};

export const useSellerStore = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handlePost = async (data: object) => {
    const response = await axios.post(`${baseUrl}/store`, data, config);
    return response.data;
  };
  return useMutation(handlePost, {
    onSuccess,
    onError: (error: any) => error,
  });
};

export const useSellerOnboard = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleSellerOnboarding = async () => {
    const response = await axios.get(`${baseUrl}/seller/onboard`, config);
    return response.data;
  };
  return useQuery("onboardSeller", handleSellerOnboarding, {
    onSuccess,

    enabled: false,
  });
};

export const useRemoveSellerOnboard = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleRemoveOnBoarding = async () => {
    const response = await axios.delete(
      `${baseUrl}/seller/remove/onboarding`,
      config
    );
    return response.data;
  };
  return useMutation("removeOnboarding", handleRemoveOnBoarding, { onSuccess });
};
export const useSellerSub = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const fetchSellerSub = async () => {
    const response = await axios.get(`${baseUrl}/seller/sub`, config);
    return response.data;
  };
  return useQuery("fetchSellerSub", fetchSellerSub, {
    onSuccess,
    enabled: false,
  });
};
export const useCreateProduct = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const createProductHandler = async (data: object) => {
    const response = await axios.post(
      `${baseUrl}/seller/product`,
      data,
      config
    );
    return response.data;
  };
  return useMutation("createproduct", createProductHandler, {
    onSuccess,
    onError: (error: any) => error,
  });
};
export const useGetStore = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const getStoreHandler = async () => {
    const response = await axios.get(`${baseUrl}/store/me`, config);
    return response.data;
  };
  return useQuery("get store", getStoreHandler, {
    onSuccess,
    onError: (error: any) => error,
    enabled: false,
  });
};
export const useGetSellerProducts = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const getSellerProducts = async () => {
    const response = await axios.get(`${baseUrl}/store/products`, config);
    return response.data;
  };
  return useQuery('get Seller"s Products', getSellerProducts, {
    onSuccess,
    enabled: false,
  });
};
export const useGeStoreProducts = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const getSellerProducts = async () => {
    const response = await axios.get(`${baseUrl}/store/me/products`, config);
    return response.data;
  };
  return useQuery("get Seller Products", getSellerProducts, {
    onSuccess,
    enabled: false,
  });
};
export const useDeleteSellerProducts = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleDeleteSellerProduct = async (data: object) => {
    const response = await axios.post(
      `${baseUrl}/seller/products`,
      data,
      config
    );
    return response.data;
  };
  return useMutation("handleDeleteSellerProducts", handleDeleteSellerProduct, {
    onSuccess,
  });
};
export const useGetStoreReviews = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const getStoreReviews = async () => {
    const response = await axios.get(`${baseUrl}/store/reviews`, config);

    const reviewDatas = response ? response.data[0][0].ratings.map(data => ({
      rate: data.rating,
      name: data.name,
      description: data.comment ? data.comment : ""
    })) : [];

    return reviewDatas;
  };
  return useQuery("get Store reviews", getStoreReviews, {
    enabled: false,
    onSuccess,
  });
};
export const useGetAllProducts = () => {
  const getAllProductsHandler = async () => {
    const response = await axios.get(`${baseUrl}/products`);
    return response.data;
  };
  return useQuery("get all products", getAllProductsHandler);
};
export const useGetTopProducts = () => {
  const getAllProductsHandler = async () => {
    const response = await axios.get(`${baseUrl}/topProducts`);
    return response.data;
  };
  return useQuery("get top products", getAllProductsHandler);
};
export const useGetOrders = (status: string, onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const getOrdersHandler = async () => {
    const response = await axios.get(
      `${baseUrl}/seller/orders?status=${status}`,
      config
    );
    return response.data;
  };
  return useQuery(`getOrders ${status}`, getOrdersHandler, {
    onSuccess,
    enabled: false,
  });
};

export const useStoreExpenseOrders = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const getOrderExpensesHandler = async () => {
    const response = await axios.get(`${baseUrl}/seller/storeExpense`, config);
    return response.data;
  };
  return useQuery(`getStoreExpenseOrders`, getOrderExpensesHandler, { onSuccess });
};

export const useBillingPayment = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleBillingPayment = async (data: object) => {
    const response = await axios.post(`${baseUrl}/seller/withdraw`, data, config);
    return response.data
  };
  return useMutation("handleBillingPaymentmut", handleBillingPayment, { onSuccess });
}

export const useCheckInvoiceDownload = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleCheckInvoiceDownload = async (data: any) => {
    try {
      const response = await axios.post(
        `${baseUrl}/seller/invoice/download`,
        data,
        config
      );
      return response.data;
    } catch (error) {
      alert(error.message);
    }
  };
  return useMutation("checkInvoiceDownload", handleCheckInvoiceDownload, {
    onSuccess,
  });
};

export const useSavePaypalAccount = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleAddPaypal = async (data: any) => {
    try {
      const response = await axios.post(
        `${baseUrl}/seller/add/paypal`,
        data,
        config
      );
      return response.data;
    } catch (error) {
      alert(error.message);
    }
  };
  return useMutation("handle Add Paypal", handleAddPaypal, {
    onSuccess,
  });
};

export const useRemovePaypalAccount = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleRemovePaypal = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/seller/remove/paypal`,
        {},
        config
      );
      return response.data;
    } catch (error) {
      alert(error.message);
    }
  };
  return useMutation("handle remove Paypal", handleRemovePaypal, {
    onSuccess,
  });
};

export const useGetOrdersShipped = (onSuccess: any) => {
  const config = useContext(ContextApi).config;

  const fetchShippedOrders = async () => {
    const response = await axios.get(
      `${baseUrl}/seller/orders/shipped`,
      config
    );
    return response.data;
  };
  return useQuery("getShippeedOrders", fetchShippedOrders, {
    onSuccess,
    enabled: false,
  });
};
export const useModifySeller = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const updateStoreHandler = async (data: object) => {
    const response = await axios.patch(`${baseUrl}/store/update`, data, config);
    return response.data;
  };
  return useMutation("update Store", updateStoreHandler, {
    onSuccess,
    onError: (error: any) => error,
  });
};
export const useModifyUser = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const updateUserHandler = async (data: object) => {
    const response = await axios.patch(`${baseUrl}/user/modify`, data, config);
    return response.data;
  };
  return useMutation("update User", updateUserHandler, {
    onSuccess,
    onError: (error: any) => error,
  });
};
export const useGetSellerInfo = (onSuccess: any) => {
  const isLoggedIn = useContext(ContextApi).isLoggedIn;
  const config = useContext(ContextApi).config;
  const role = Cookies.get("role");

  if (config) {
    const getSellerHandler = async () => {
      if (isLoggedIn == false) {
        let response = {}
        return response;
      } else {
        if (role == "seller") {
          const response = await axios.get(`${baseUrl}/seller/me`, config);
          return response.data;
        }

      }
    };
    return useQuery("get Seller", getSellerHandler, {
      onSuccess,
      onError: (error: any) => error,
      enabled: false,
    });
  }
};


type getSellerRequest = {
  _id: string;
};
export const useGetSellerRequestMessage = (onSuccess: any) => {
  const config = useContext(ContextApi).config;

  const getSellerRequestMessage = async () => {
    const response = await axios.get(`${baseUrl}/seller/request/`, config);
    return response.data;
  };

  return useQuery("getSellerRequestMessage", getSellerRequestMessage, {
    onSuccess,
    enabled: false,
  });
};
export const useGetStoreActivity = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const getSellerActivity = async () => {
    const response = await axios.get(`${baseUrl}/seller/activity`, config);
    return response.data;
  };
  return useQuery("getSellerActivity", getSellerActivity, {
    onSuccess,
    enabled: false,
  });
};
export const useGetSellerLink = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const getSellerLink = async () => {
    const response = await axios.get(`${baseUrl}/seller/loginlink`, config);
    return response.data;
  };
  return useQuery("getSellerLink", getSellerLink, {
    onSuccess,
    enabled: false,
  });
};
export const useCheckSellerPayout = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const checkSellerPayout = async () => {
    const response = await axios.get(`${baseUrl}/seller/check/payout`, config);
    return response.data;
  };
  return useQuery("checkSellerPayout", checkSellerPayout, {
    onSuccess,
    enabled: false,
  });
};
export const useGetSellerDeliveredOrders = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const fetchSellerDeliveredOrders = async () => {
    const response = await axios.get(
      `${baseUrl}/seller/orders/delivered`,
      config
    );
    return response.data;
  };
  return useQuery("fetchSellerDeliveredOrders", fetchSellerDeliveredOrders, {
    onSuccess,
    enabled: false,
  });
};
export const useGetDeleteSellerSub = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const deleteSellerHandler = async () => {
    const response = await axios.delete(`${baseUrl}/seller/cancel`, config);
    return response.data;
  };
  return useMutation("cancelSellerSub", deleteSellerHandler, { onSuccess });
};
export const useGetSellerPortalSession = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleFetchSellerSessionPortal = async (data: object) => {
    const response = await axios.post(
      `${baseUrl}/seller/create-customer-billing-session`,
      {},
      config
    );
    return response.data;
  };
  return useMutation(
    `fetchSellerSessionPortal`,
    handleFetchSellerSessionPortal,
    {
      onSuccess,
      onError: (error: any) => error,
    }
  );
};
export const useGetUser = () => {
  const config = useContext(ContextApi).config;
  const getUserHandler = async () => {
    const response = await axios.get(`${baseUrl}/user`, config);
    return response.data;
  };
  return useQuery("get user", getUserHandler, { enabled: false });
};
export const useUpdateProduct = (id: string, onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const updateProductHandler = async (data: object) => {
    const response = await axios.patch(
      `${baseUrl}/product/${id}`,
      data,
      config
    );
    return response.data;
  };
  return useMutation("update Product", updateProductHandler, {
    onSuccess,
  });
};
export const useGetSellerAds = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const getSellerAdProducts = async () => {
    const response = await axios.get(`${baseUrl}/seller/ads`, config);
    return response.data;
  };
  return useQuery("getSellerAds", getSellerAdProducts, {
    onSuccess,
    enabled: false,
  });
};
export const usePromoteAd = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handlePromoteAd = async (data: object) => {
    const response = await axios.post(`${baseUrl}/seller/ads`, data, config);
    return response.data;
  };
  return useMutation("promoteAd", handlePromoteAd, {
    onSuccess,
  });
};
export const useGetSellerRecentOrder = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleGetOrders = async () => {
    const response = await axios.get(`${baseUrl}/seller/recentorders`, config);
    return response.data;
  };
  return useQuery("getRecentSellerOrders", handleGetOrders, {
    onSuccess,
    enabled: false,
  });
};
export const useGetSellerTopProducts = () => {
  const config = useContext(ContextApi).config;
  const handleGetSellerProducts = async () => {
    const response: AxiosResponse = await axios.get(
      `${baseUrl}/seller/topProducts`,
      config
    );
    return response.data;
  };
  return useQuery("getSellerTopProducts", handleGetSellerProducts, {
    enabled: false,
  });
};
export const useGetSellerStats = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleGetSellerStats = async () => {
    const response = await axios.get(`${baseUrl}/seller/store/stat`, config);
    return response.data;
  };
  return useQuery("getSellerStats", handleGetSellerStats, {
    onSuccess,
    enabled: false,
  });
};
export const useGetSellerRefunds = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleGetSellerRefunds = async () => {
    const response = await axios.get(`${baseUrl}/seller/refunds`, config);
    return response.data;
  };
  return useQuery("getSellerRefunds", handleGetSellerRefunds, {
    onSuccess,
    enabled: false,
  });
};
export const useGetUserWishlist = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleGetUserWishlist = async () => {
    const response = await axios.get(`${baseUrl}/user/wishlist`, config);
    return response.data;
  };
  return useQuery("getUserWishlist", handleGetUserWishlist, {
    onSuccess,
    enabled: false,
  });
};
export const useAddUserWishlist = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleAddUserWishlist = async (data: any) => {
    const response = await axios.post(`${baseUrl}/user/wishlist`, data, config);
    return response.data;
  };
  return useMutation("addUserToWishlist", handleAddUserWishlist, { onSuccess });
};

export const useFollowSeller = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleFollowSeller = async (sellerId: string) => {
    const response = await axios.get(
      `${baseUrl}/user/follow/${sellerId}`,
      config
    );
    return response.data;
  };
  return useMutation("followSeller", handleFollowSeller, { onSuccess });
};
export const useAddToCart = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleAddToCart = async (data: any) => {
    const response = await axios.post(`${baseUrl}/cart`, data, config);
    return response.data;
  };
  return useMutation("addToCart", handleAddToCart, { onSuccess });
};
export const useGetCart = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleGetCart = async () => {
    const response = await axios.get(`${baseUrl}/cart`, config);
    return response.data;
  };
  return useQuery("getUserCart", handleGetCart, { onSuccess, enabled: false });
};
export const useIncrementCart = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleIncrementCart = async (data: any) => {
    const response = await axios.post(
      `${baseUrl}/cart/increment`,
      data,
      config
    );
    return response.data;
  };
  return useMutation("incrementCart", handleIncrementCart, { onSuccess });
};
export const useDecrementCart = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleDecrementCart = async (data: any) => {
    const response = await axios.post(
      `${baseUrl}/cart/decrement`,
      data,
      config
    );
    return response.data;
  };
  return useMutation("decrementCart", handleDecrementCart, { onSuccess });
};
export const useDeleteCart = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleDeleteCart = async (data: string) => {
    const response = await axios.delete(`${baseUrl}/cart?id=${data}`, config);
    return response.data;
  };
  return useMutation("handleDeleteCart", handleDeleteCart, { onSuccess });
};
export const useDeleteWish = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleDeleteWish = async (data: string[]) => {
    if (data.length == 1) {
      const response = await axios.delete(
        `${baseUrl}/wishlist?ids=${data[0]}`,
        config
      );
      return response.data;

    } else {
      const response = await axios.post(
        `${baseUrl}/wishlist`, { ids: data },
        config
      );
      return response.data;
    }
  };
  return useMutation("handleDeleteWishlist", handleDeleteWish, { onSuccess });
};
export const useDeleteSingleWish = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleSingleDelete = async (data: string) => {
    const response = await axios.delete(`${baseUrl}/wishlist/${data}`, config);
    return response.data;
  };
  return useMutation("handleSingleDelete", handleSingleDelete, { onSuccess });
};
export const useGetUserOrders = (onSuccess: any, status: string) => {
  const config = useContext(ContextApi).config;
  const getUserOrders = async () => {
    const response = await axios.get(
      `${baseUrl}/user/order?status=${status}`,
      config
    );
    return response.data;
  };
  return useQuery(`orders${status}`, getUserOrders, {
    onSuccess,
    enabled: false,
  });
};
export const useGetUserOrdersShipped = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const getUserOrders = async () => {
    const response = await axios.get(`${baseUrl}/user/order/shipped`, config);
    return response.data;
  };
  return useQuery(`UserOrdersShipped`, getUserOrders, {
    onSuccess,
    enabled: false,
  });
};
export const useCloseUserAccount = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const getUserOrders = async (data: object) => {
    const response = await axios.post(`${baseUrl}/user/close`, data, config);
    return response.data;
  };
  return useMutation("closeuser", getUserOrders, { onSuccess });
};
export const useGetUserAddress = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const getUserAddress = async () => {
    const response = await axios.get(`${baseUrl}/user/address`, config);
    return response.data;
  };
  return useQuery("getUserAddress", getUserAddress, {
    onSuccess,
    enabled: false,
  });
};
export const useGetUserAddressOnRefetch = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const getUserAddress = async () => {
    const response = await axios.get(`${baseUrl}/user/address`, config);
    return response.data;
  };
  return useQuery("getUserAddress", getUserAddress, {
    onSuccess,
    enabled: false,
  });
};
export const useUserPostAddress = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const postUserAddress = async (data: object) => {
    const response = await axios.post(`${baseUrl}/user/address`, data, config);
    return response.data;
  };
  return useMutation("postUserAddress", postUserAddress, { onSuccess });
};
export const useUserPostBillAddress = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const postUserAddress = async (data: object) => {
    const response = await axios.post(
      `${baseUrl}/user/bill/address`,
      data,
      config
    );
    return response.data;
  };
  return useMutation("postUserAddress", postUserAddress, { onSuccess });
};
export const useUpdateUserAddress = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const updateUserAddress = async (data: any) => {
    const response = await axios.patch(
      `${baseUrl}/user/address/${data.id}`,
      data,
      config
    );
    return response.data;
  };
  return useMutation("updateUserAddress", updateUserAddress, { onSuccess });
};
export const useDeleteAddress = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleDeleteAddress = async (id: string) => {
    const response = await axios.delete(
      `${baseUrl}/user/address/${id}`,
      config
    );
    return response.data;
  };
  return useMutation("deleteAddress", handleDeleteAddress, { onSuccess });
};
export const useUpdateDefault = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleUpdateDefault = async (data: any) => {
    const response = await axios.patch(
      `${baseUrl}/user/address/default/${data.id}`,
      {},
      config
    );
    return response.data;
  };
  return useMutation("updateDefaultAddress", handleUpdateDefault, {
    onSuccess,
  });
};
export const useHandleCheckout = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleFetchUserCheckout = async () => {
    const response = await axios.get(`${baseUrl}/user/checkout`, config);
    return response.data;
  };
  return useQuery("handleUserCheckout", handleFetchUserCheckout, {
    onSuccess,
    enabled: false,
  });
};
export const useHandlePayment = (onSuccess: any) => {
  // console.log("adfasdfa");
  const config = useContext(ContextApi).config;

  const handleCheckout = async (data: object) => {
    const response = await axios.post(`${baseUrl}/user/payment`, data, config);

    return response.data;
  };
  return useMutation("handleUserCheckout", handleCheckout, { onSuccess });
};
export const useVerifyUserPayment = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const donesticShipping = localStorage.getItem("donesticShipping");

  const handlePayment = async (address: string) => {
    const response = await axios.post(
      `${baseUrl}/user/verify/payment`,
      {
        address,
        "donesticShipping": donesticShipping
      },
      config
    );
    // console.log(response);
    // alert(response);

    return response.data;
  };
  return useMutation("handleUserPayment", handlePayment, { onSuccess });
};
export const useUpdateOrder = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleUpdateOrder = async (data: any) => {
    const response = await axios.patch(
      `${baseUrl}/seller/order/${data.id}`,
      data,
      config
    );

    return response.data;
  };
  return useMutation("handleUpdateOrder", handleUpdateOrder, {
    onSuccess,
  });
};
export const useRateProduct = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleRating = async (data: object) => {
    const response = await axios.post(`${baseUrl}/user/rate`, data, config);
    return response.data;
  };
  return useMutation("handleRating", handleRating, { onSuccess });
};
export const useAdminLogin = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleLogin = async (data: object) => {
    const response = await axios.post(`${baseUrl}/admin/login`, data, config);
    return response.data;
  };
  return useMutation("loginAdmin", handleLogin, { onSuccess });
};

export const useGetAdminVerifyCode = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleGetAdminVerifyCode = async (data: object) => {
    const response = await axios.post(`${baseUrl}/admin/verifyCode`, data, config);
    return response.data;
  };
  return useMutation("getAdminVerifyCode", handleGetAdminVerifyCode, { onSuccess });
};

export const useVerifyAdmin = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleVerifyAdmin = async (data: object) => {
    const response = await axios.post(`${baseUrl}/admin/verify`, data, config);
    return response.data;
  };
  return useMutation("verifyAdmin", handleVerifyAdmin, { onSuccess });
};
export const useFetchAllOrders = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const handleFetchOrders = async () => {
    const response = await axios.get(`${baseUrl}/admin/allorders`, config);
    return response.data;
  };
  return useQuery("fetchAllOrders", handleFetchOrders, {
    onSuccess,
    onError: (error) => error,
    enabled: false,
  });
};
export const useFetchProductForAdmin = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const handleFetchProducts = async () => {
    const response = await axios.get(`${baseUrl}/admin/products`, config);
    return response.data;
  };
  return useQuery("fetchProductsForAdmin", handleFetchProducts, {
    onSuccess,
    enabled: false,
  });
};
type IUpdateAdminProduct = {
  id: string;
};
export const useUpdateAdminProducts = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const handleUpdateProduct = async (data: IUpdateAdminProduct) => {
    const response = await axios.patch(
      `${baseUrl}/admin/product/${data.id}`,
      {},
      config
    );
    return response.data;
  };
  return useMutation("updateAdminProduct", handleUpdateProduct, {
    onSuccess,
  });
};
export const useAdminUpdateProductCategory = (id: string, onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const updateAdminProductHandler = async (data: object) => {
    const response = await axios.patch(
      `${baseUrl}/admin/productCategory/${id}`,
      data,
      config
    );
    return response.data;
  };
  return useMutation("update Admin Product", updateAdminProductHandler, {
    onSuccess,
  });
};
export const useUpdateSellerProductActive = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleUpdate = async (data: IUpdateAdminProduct) => {
    const response = await axios.patch(
      `${baseUrl}/seller/product/active/${data.id}`,
      {},
      config
    );
    return response.data;
  };
  return useMutation("updateProductActive", handleUpdate, {
    onSuccess,
  });
};
export const useAdminSellers = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const handleFetchAdminSellers = async () => {
    const response = await axios.get(`${baseUrl}/admin/sellers`, config);
    return response.data;
  };
  return useQuery("fetchAdminSellers", handleFetchAdminSellers, {
    onSuccess,
    enabled: false,
  });
};

export const useAdminReports = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const handleFetchAdminReport = async () => {
    const response = await axios.get(`${baseUrl}/api/report`, config);
    return response.data;
  };
  return useQuery("fetchAdminSellers", handleFetchAdminReport, {
    onSuccess,
    enabled: false,
  });
};
export const useUpdateAdminSellers = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const handleUpdateSeller = async (data: IUpdateAdminProduct) => {
    const response = await axios.patch(
      `${baseUrl}/admin/seller/${data.id}`,
      {},
      config
    );
    return response.data;
  };
  return useMutation("updateAdminProduct", handleUpdateSeller, {
    onSuccess,
  });
};

export const useUpdateSellerPausedPayout = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const handleUpdateSeller = async (data: IUpdateAdminProduct) => {
    const response = await axios.patch(
      `${baseUrl}/admin/seller/pausedPayout/${data.id}`,
      {},
      config
    );
    return response.data;
  };
  return useMutation("updateAdminProduct", handleUpdateSeller, {
    onSuccess,
  });
};
export const useDeleteAdminSeller = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const handleDeleteSeller = async (data: IUpdateAdminProduct) => {
    const response = await axios.delete(
      `${baseUrl}/admin/seller/${data.id}`,
      config
    );
    return response.data;
  };
  return useMutation("deleteAdminSeller", handleDeleteSeller, {
    onSuccess,
  });
};
export const useDeleteAdminUser = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const handleDeleteUser = async (data: IUpdateAdminProduct) => {
    const response = await axios.delete(
      `${baseUrl}/admin/user/${data.id}`,
      config
    );
    return response.data;
  };
  return useMutation("deleteAdminUser", handleDeleteUser, {
    onSuccess,
  });
};
export const useUpdateAdminUser = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const handleUpdateUser = async (data: IUpdateAdminProduct) => {
    const response = await axios.patch(
      `${baseUrl}/admin/user/${data.id}`,
      {},
      config
    );
    return response.data;
  };
  return useMutation("updateAdminUser", handleUpdateUser, {
    onSuccess,
  });
};
export const useGetAdminUsers = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;

  const handleFetchUsers = async () => {
    const response = await axios.get(`${baseUrl}/admin/users`, config);
    return response.data;
  };
  return useQuery("fetchAllAdminUsers", handleFetchUsers, {
    onSuccess,
    enabled: false,
  });
};

export const useCreateContact = (onSuccess: any) => {
  const handleCreateContact = async (data: contactUsDefaultValue) => {
    const response = await axios.post(`${baseUrl}/user/contact`, data);
    return response.data;
  };
  return useMutation("contactUs", handleCreateContact, {
    onSuccess,
  });
};

export const useFetchAllContacts = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const handleFetchContacts = async () => {
    const response = await axios.get(`${baseUrl}/contacts`, config);
    return response.data;
  };
  return useQuery("fetchAllContacts", handleFetchContacts, {
    onSuccess,
    onError: (error) => error,
    enabled: false,
  });
};

export const useDeleteContact = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const handleDeleteContact = async (data: any) => {
    const response = await axios.patch(
      `${baseUrl}/admin/delete/contact/${data.id}`,
      {},
      config
    );
    return response.data;
  };
  return useMutation("deleteContact", handleDeleteContact, {
    onSuccess,
  });
};

export const useReplyContact = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const handleReplyContact = async (data: contactReplyDefaultValue) => {
    const response = await axios.post(`${baseUrl}/admin/reply/contact`, data, config);
    return response.data;
  };
  return useMutation("replyContact", handleReplyContact, {
    onSuccess,
  });
};

export const useFetchFeedbacks = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const handleFetchFeedBacks = async () => {
    const response = await axios.get(`${baseUrl}/admin/feedbacks`, config);
    return response.data;
  };
  return useQuery("fetchFeedbacks", handleFetchFeedBacks, {
    onSuccess,
    enabled: false,
  });
};
export const useGetUserRatings = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const handleFetchRatings = async () => {
    const response = await axios.get(`${baseUrl}/admin/ratings`, config);
    return response.data;
  };
  return useQuery(`fetchUserRatings`, handleFetchRatings, {
    onSuccess,
    enabled: false,
  });
};
export const useGetAdmins = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const handleFetchAdmins = async () => {
    const response = await axios.get(`${baseUrl}/admins`, config);
    return response.data;
  };
  return useQuery(`fetchAdmins`, handleFetchAdmins, {
    onSuccess,
    enabled: false,
  });
};
export const useCreateAdmins = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const handleCreateAdmins = async (data: object) => {
    const response = await axios.post(`${baseUrl}/admin/create`, data, config);
    return response.data;
  };
  return useMutation("createAdmins", handleCreateAdmins, {
    onSuccess,
  });
};

export const useCreateReport = (onSuccess: any) => {
  const handleCreateReport = async (data: object) => {
    const response = await axios.post(`${baseUrl}/api/report`, data);
    return response.data;
  };
  return useMutation("createReport", handleCreateReport, {
    onSuccess,
  });
};

type IModal = {
  modal: {
    productId: string;
  };
};
export const useGetAdmin = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const adminId = useSelector((state: IModal) => state.modal.productId);
  const handleFetchAdmin = async () => {
    const response = await axios.get(`${baseUrl}/admin/id/${adminId}`, config);
    return response.data;
  };
  return useQuery("getAdmin", handleFetchAdmin, {
    onSuccess,
    enabled: false,
  });
};
export const useUpdateAdmin = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const adminId = useSelector((state: IModal) => state.modal.productId);

  const handleUpdateAdmin = async (data: object) => {
    const response = await axios.patch(
      `${baseUrl}/admin/edit/${adminId}`,
      data,
      config
    );
    return response.data;
  };
  return useMutation("UpdateAdmin", handleUpdateAdmin, {
    onSuccess,
  });
};
export const useDeleteAdmin = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;

  const handleDeleteAdmin = async (data: object) => {
    const response = await axios.post(`${baseUrl}/admin/delete`, data, config);
    return response.data;
  };
  return useMutation("deleteAdmin", handleDeleteAdmin, {
    onSuccess,
  });
};
export const useFetchRefunds = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const handleFetchRefunds = async () => {
    const response = await axios.get(`${baseUrl}/admin/refund`, config);
    return response.data;
  };
  return useQuery("handleFetchRefunds", handleFetchRefunds, {
    onSuccess,
    enabled: false,
  });
};

export const useSellerUpdateRefund = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const updateRefundHandler = async (data: any) => {
    const response = await axios.patch(`${baseUrl}/seller/refunds/status/${data.id}`, { status: data.status }, config);
    return response.data;
  };
  return useMutation("update Refund", updateRefundHandler, {
    onSuccess,
    onError: (error: any) => error,
  });
};
export const useAdminModifyRefund = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const updateAdminRefundHandler = async (data: any) => {
    const response = await axios.patch(`${baseUrl}/admin/refund/${data.id}`, { status: data.status }, config);
    return response.data;
  };
  return useMutation("update Admin Refund", updateAdminRefundHandler, {
    onSuccess,
    onError: (error: any) => error,
  });
};

export const useFetchStores = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const handleFetchStores = async () => {
    const response = await axios.get(`${baseUrl}/admin/reviews`, config);
    return response.data;
  };
  return useQuery("handleFetchStores", handleFetchStores, {
    onSuccess,
    refetchInterval: 5000,
    enabled: false,
  });
};
export const useDeleteStoreId = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const handleDeleteStoreId = async (data: IUpdateAdminProduct) => {
    const storeId = data.id;
    const response = await axios.delete(
      `${baseUrl}/admin/review/${storeId}`,
      config
    );
    return response.data;
  };
  return useMutation("deleteSellerStore", handleDeleteStoreId, {
    onSuccess,
  });
};
type TUpdateSellerStatus = {
  id: string;
  active: string;
};
export const useUpdateSellerStatus = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const handleUpdateSeller = async (data: TUpdateSellerStatus) => {
    const response = await axios.patch(
      `${baseUrl}/admin/seller/active/${data.id}?active=${data.active}`,
      {},
      config
    );
    return response.data;
  };
  return useMutation("updateSellerStatus", handleUpdateSeller, {
    onSuccess,
  });
};

export const useCreateRequestForSellerVerification = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;

  const handleRequest = async (data: object) => {
    const response = await axios.post(`${baseUrl}/admin/request`, data, config);
    return response.data;
  };
  return useMutation("postVerificationRequest", handleRequest, { onSuccess });
};
export const useUpdateSellerVerification = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const handleUpdateSeller = async (data: IUpdateAdminProduct) => {
    const response = await axios.patch(
      `${baseUrl}/admin/review/${data.id}`,
      {},
      config
    );
    return response.data;
  };
  return useMutation("UpdateSellerStore", handleUpdateSeller, {
    onSuccess,
  });
};
export const useGetAppStats = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const handleGetStats = async () => {
    const response = await axios.get(`${baseUrl}/admin/user/stats`, config);
    return response.data;
  };
  return useQuery("handleGetAppStats", handleGetStats, {
    onSuccess,
    enabled: false,
  });
};
export const useGetOrdersStats = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const handleGetOrderStats = async () => {
    const response = await axios.get(`${baseUrl}/admin/orders/stats`, config);
    return response.data;
  };
  return useQuery("getOrdersStats", handleGetOrderStats, {
    onSuccess,
    enabled: false,
  });
};
// export const useGetOrdersMonthly = (onSuccess : any) => {
//     const config = useContext(ContextApi).adminConfig;
//     const handleGetYearlyOrders  = async () => {
//         const response = await axios.get(`${baseUrl}/admin/yearly`, config);
//         return response.data
//     }
//     return useQuery('getOrderMonthly', handleGetYearlyOrders, {
//         onSuccess
//     })
// }
export const useGetOrdersMonthly2 = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const handleGetYearlyOrders2 = async () => {
    const response = await axios.get(`${baseUrl}/admin/yearly`, config);
    return response.data;
  };
  return useQuery("getOrderMonthly2", handleGetYearlyOrders2, {
    onSuccess,
    enabled: false,
  });
};
export const useSendDeliveredOrders = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const sendDeliveredOrders = async () => {
    const response = await axios.post(
      `${baseUrl}/admin/send/delivery`,
      {},
      config
    );
    return response.data;
  };
  return useMutation("sendDeliveredOrders", sendDeliveredOrders, { onSuccess });
};
export const useUpdateSellerDoc = (onSuccess) => {
  const config = useContext(ContextApi).config;
  const handleUpdateSellerDoc = async (data: object) => {
    const response = await axios.post(
      `${baseUrl}/seller/reverify`,
      data,
      config
    );
    return response.data;
  };
  return useMutation("updateSellerDoc", handleUpdateSellerDoc, {
    onSuccess,
  });
};
export const useFindStore = (onSuccess: any) => {
  const handleFindStore = async (data) => {
    const response = await axios.get(`${baseUrl}/findstore/${data.id}`);
    return response.data;
  };
  return useQuery("handleFindStore", handleFindStore, {
    onSuccess,
  });
};

export const useGetBrands = (onSuccess: any) => {
  const handleFetchbrands = async () => {
    const response = await axios.get(`${baseUrl}/brands`);
    return response.data;
  };
  return useQuery("handleFetchBrands", handleFetchbrands, {
    onSuccess,
  });
};

export const useGetAllStores = (onSuccess: any) => {
  const handleFetchAllStores = async () => {
    const response = await axios.get(`${baseUrl}/allstores`);
    return response.data;
  };
  return useQuery("handleFetchAllStores", handleFetchAllStores, {
    onSuccess,
  });
};
export const useChangeUserPassword = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleUpdatePassword = async (data: object) => {
    const response = await axios.post(`${baseUrl}/user/security`, data, config);
    return response.data;
  };
  return useMutation("handleUpdatePassword", handleUpdatePassword, {
    onSuccess,
  });
};
export const useChangeUserPhone = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleUpdateUserPhone = async (data: object) => {
    const response = await axios.post(`${baseUrl}/user/phone`, data, config);
    return response.data;
  };
  return useMutation("handleUpdateUserPhone", handleUpdateUserPhone, {
    onSuccess,
  });
};
export const useGetUserRecommendation = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleGetUserRecommendations = async () => {
    const response = await axios.get(`${baseUrl}/user/recommendation`, config);
    return response.data;
  };
  return useQuery("getUserRecommendation", handleGetUserRecommendations, {
    onSuccess,
  });
};
export const useGetHotDeals = (onSuccess: any) => {
  const handleFetchHotDeals = async () => {
    const response = await axios.get(`${baseUrl}/hotdeals`);
    return response.data;
  };
  return useQuery("handleFetchDeals", handleFetchHotDeals, { onSuccess });
};
export const usePostUserRefunds = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleFetchUser = async (data: object) => {
    const response = await axios.post(`${baseUrl}/user/refund`, data, config);
    return response.data;
  };
  return useMutation("handleFetchUser", handleFetchUser, {
    onSuccess,
  });
};

export const usePostUserExperience = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handlePostUserExperience = async (data: object) => {
    const response = await axios.post(`${baseUrl}/user/shopping`, data, config);
    return response.data;
  };
  return useMutation(`handlePostUserExperience`, handlePostUserExperience, {
    onSuccess,
  });
};

export const useReadFeedback = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const handleReadFeedback = async (data: any) => {
    const response = await axios.patch(`${baseUrl}/admin/feedback/${data.id}`, {}, config);
    return response.data;
  };
  return useMutation("readFeedback", handleReadFeedback, {
    onSuccess,
  });
};

// export const useGetHotDeals = (onSuccess : any) => {
//     const handleFetchHotDeals  = async () => {
//         const response = await axios.get(`${baseUrl}/user/deals`);
//         return response.data;
//     }
//     return useQuery('fetchHotDeals', handleFetchHotDeals, {
//         onSuccess
//     })
// }
export const useGetSellerOrderStats = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleFetchOrderStats = async () => {
    const response = await axios.get(
      `${baseUrl}/seller/orders/weeklystats`,
      config
    );
    return response.data;
  };
  return useQuery("fetchStatsOrdersStats", handleFetchOrderStats, {
    onSuccess,
    enabled: false,
  });
};
const sleep = (m) => new Promise((r) => setTimeout(r, m));

export const useGetSellerStatus = (onSuccess: any) => {
  const handleFetchSellerStatus = async () => {
    await sleep(1000);
    // const isLoggedIn = localStorage.getItem("token");
    const isLoggedIn = Cookies.get("token");
    const token = encodeURI(isLoggedIn);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`${baseUrl}/seller/isComplete`, config);
    return response.data;
  };
  return useQuery("handleFetchSellerStatus", handleFetchSellerStatus, {
    onSuccess,
    enabled: false,
  });
};
export const useDeleteAdminProduct = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const handleDeleteProducct = async (data: IUpdateAdminProduct) => {
    const response = await axios.delete(
      `${baseUrl}/admin/product/${data.id}`,
      config
    );
    return response.data;
  };
  return useMutation("deleteAdminProduct", handleDeleteProducct, {
    onSuccess,
  });
};
export const useSellerCancelledOrder = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleFetchOrder = async () => {
    const response = await axios.get(
      `${baseUrl}/seller/orders/cancelled`,
      config
    );
    return response.data;
  };
  return useQuery("fetchCancelledSellerOrder", handleFetchOrder, {
    onSuccess,
    enabled: false,
  });
};

export const useCancelledOrder = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleFetchOrder = async () => {
    const response = await axios.get(`${baseUrl}/user/order/cancelled`, config);
    return response.data;
  };
  return useQuery("fetchCancelledOrder", handleFetchOrder, {
    onSuccess,
  });
};

export const useProcessedOrder = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleFetchOrder = async () => {
    const response = await axios.get(`${baseUrl}/user/order/processed`, config);
    return response.data;
  };
  return useQuery("fetchProcessedOrder", handleFetchOrder, {
    onSuccess,
  });
};

export const useDeleteAdminOrder = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const handleDeleteOrder = async (data: IUpdateAdminProduct) => {
    const response = await axios.delete(
      `${baseUrl}/admin/order/${data.id}`,
      config
    );
    return response.data;
  };
  return useMutation("deleteAdminOrder", handleDeleteOrder, {
    onSuccess,
  });
};
export const useFetchAdminStores = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const handleFetchStores = async () => {
    const response = await axios.get(`${baseUrl}/admin/stores`, config);
    return response.data;
  };
  return useQuery("fetchStoresForAdmin", handleFetchStores, { onSuccess });
};
export const useUpdatePayout = (onSuccess: any) => {
  const config = useContext(ContextApi).adminConfig;
  const handlePayout = async (data: object) => {
    const response = await axios.post(`${baseUrl}/admin/payout`, data, config);
    return response.data;
  };
  return useMutation("adminPayout", handlePayout, { onSuccess });
};
export const useGetCategoryById = (onSuccess: any, id: string) => {
  const fetchCategory = async (data: object) => {
    const response = await axios.get(`${baseUrl}/category/${id}`);
    return response.data;
  };
  return useQuery("fetchCategoryById", fetchCategory, {
    onSuccess,
    onError: (e: any) => e,
    enabled: false,
  });
};

export const useUpdateSellerFile = (onSuccess: any) => {
  const config = useContext(ContextApi).config;

  const handleUpdateSellerFile = async (data: object) => {
    const response = await axios.post(
      `${baseUrl}/seller/reverify`,
      data,
      config
    );
    return response.data;
  };

  return useMutation("handleUpdateSellerFile", handleUpdateSellerFile, {
    onSuccess,
  });
};

export const createNewChatRoom = (chatRoom: IChatRoom) => async (dispatch) => {
  const response = await axios.post(`${baseUrl}/chatRoom`, chatRoom);
  if (response.status === 201) {
    dispatch(insertNewChatRoom(response.data.room));
    dispatch(removeDuplications());
    localStorage.setItem("currentChatRoomName", response.data.room.roomName);
    return response.status;
  } else if (response.status === 200) {
    localStorage.setItem("currentChatRoomName", response.data.room.roomName);
    return response.status;
  } else {
    return "failed";
  }
};

export const useGetAllTemplates = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const getTemplatesHandler = async () => {
    const response = await axios.get(`${baseUrl}/seller/template`, config);
    return response.data;
  };
  return useQuery("allTemplates", getTemplatesHandler, { onSuccess });
};

export const useGetTemplate = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const getTemplateByIdHandler = async (data: any) => {
    const response = await axios.get(`${baseUrl}/seller/template/${data.id}`, config);
    return response.data;
  };
  return useQuery("getTemplate", getTemplateByIdHandler, { onSuccess });
};

export const useUpdateTemplate = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const handleUpdateTemplate = async (data: any) => {
    const response = await axios.patch(
      `${baseUrl}/seller/template/${data.id}`,
      data.data,
      config
    );
    return response.data;
  };
  return useMutation("handleUpdateTemplate", handleUpdateTemplate, { onSuccess });
};

export const useCreateTemplate = (onSuccess: any) => {
  const config = useContext(ContextApi).config;
  const createTemplateHandler = async (data: object) => {
    const response = await axios.post(
      `${baseUrl}/seller/template`,
      data,
      config
    );
    return response.data;
  };
  return useMutation("createproduct", createTemplateHandler, { onSuccess, onError: (error: any) => error });
};
