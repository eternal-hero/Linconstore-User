import React, { useCallback, useState } from "react";
import Head from "next/head";
import {
  Card,
  CircularProgress,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import { ArrowBack } from "@mui/icons-material";
import OrdersAccordion from "../Utils/OrdersAccordion";
import { useGetOrders } from "../../hooks/useDataFetch";
import { useRouter } from "next/router";
import {
  addAddress,
  IAdminProducts,
  IUser,
  IVariants,
} from "../../Helpers/Types";
import { useTranslation } from "react-i18next";
import { useTokenRefetch } from "../../hooks/useRefresh";

interface IOrders {
  userId: IUser;
  productId: IAdminProducts;
  _id: string;
  status: string;
  active: boolean;
  address: string;
  variants: IVariants[];
  type: string;
  shipping: string;
  shippingProvider: string;
  trackingId: string;
  quantity: number;
  createdAt: Date;
}
interface INewOrders {
  order: IOrders;
  address: addAddress;
}
const OrdersPlaced: React.FC = () => {
  const [search, setSearch] = useState("");
  const { t } = useTranslation();

  const [orders, setOrders] = useState<INewOrders[]>([]);
  const onSuccess = (data: INewOrders[] | string) => {
    if (data !== "No Orders") {
      // @ts-ignore
      setOrders(data);
    }
  };
  const { isLoading, isFetched, refetch, data } = useGetOrders(
    "placed",
    onSuccess
  );
  useTokenRefetch(refetch);
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const searchItem = event.target.value.toLowerCase();
      setSearch(searchItem);
      const orderPlaceholder = data?.filter((x) =>
        x?.order?.name.toLowerCase().includes(searchItem)
      );
      setOrders(orderPlaceholder);
    },
    [search, data]
  );
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{t("pagetitle.OrdersPlaced")}</title>
        <meta name={"Order placed"} content={"These are Order placed"} />
        <link rel="icon" href="/favicon-store.ico" />
      </Head>
      <Card elevation={0} sx={{ bgcolor: "transparent", mt: 1, p: 2 }}>
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
        {isFetched && orders?.length > 0 ? (
          <>
            {orders.map(({ order, address }, index) => (
              <OrdersAccordion
                order={order}
                address={address}
                key={index}
                onCompleted={() => refetch()}
              />
            ))}
          </>
        ) : (
          <Typography variant={"h6"} fontWeight={500}>
            {t("seller.orderPlaced.alert_text")}
          </Typography>
        )}
        {isLoading && <CircularProgress />}
      </Card>
    </>
  );
};
export default OrdersPlaced;
