/* eslint-disable react/no-unescaped-entities */
import Head from "next/head";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import {
  CircularProgress,
  Stack,
  useMediaQuery,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import ShopCard from "../Utils/ShopCard";
import Grid from "@mui/material/Grid";
import ShopOverviewCard from "../Utils/ShopOverviewCard";
import { ArrowBack } from "@mui/icons-material";
import { numberWithCommas } from "../../Helpers/utils";
import { useRouter } from "next/router";
import {
  useGetSellerOrderStats,
  useGetSellerRecentOrder,
  useGetSellerStats,
  useGetSellerTopProducts,
  useGetStore,
} from "../../hooks/useDataFetch";
import { useTranslation } from "react-i18next";
import { useTokenRefetch } from "../../hooks/useRefresh";

type Stats = {
  value: number;
  title: string;
};
interface Idata {
  totalVisitors: number;
  totalProducts: number;
  totalSales: number;
  totalExpenses: number;
  totalOrders: number;
  followersCount: number;
  orders: any;
}

interface IMonthlyStats {
  day1: number;
  day2: number;
  day3: number;
  day4: number;
  day5: number;
  day6: number;
  day7: number;
}
interface Iutil {
  util: {
    sellerRate: number;
  };
}
const Shop: React.FC = () => {
  const [stats, setStats] = useState<Stats[]>([]);
  const onSuccess = (data: Idata) => {
    const { totalSales: initialSales } = data;
    const orders = data.orders;
    const duplicateCount = orders.length - new Set(orders.map(item => item.sellerId)).size;
    const totalSales = Number(initialSales.toFixed(2));
    const shopStat: Stats[] = [
      {
        value: data.followersCount,
        title: t("seller.store_stats.store_followers"),
      },
      {
        value: numberWithCommas(totalSales) as unknown as number,
        title: t("seller.store_stats.gross_sales"),
      },
      {
        value: data.totalOrders,
        title: t("seller.store_stats.pending_orders"),
      },
      {
        value: data.totalProducts,
        title: t("seller.store_stats.total_products"),
      },
      {
        value: duplicateCount,
        title: t("seller.store_stats.Customers"),
      },
    ];
    setStats(shopStat);
  };
  const router = useRouter();
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const {
    data: sellerStats,
    isLoading: statsIsLoading,
    isFetched: statsIsFetched,
    refetch: statRefetch,
  } = useGetSellerStats(onSuccess);
  useTokenRefetch(statRefetch);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const onSellerRecentOrderSuccess = (data: any) => {
    setRecentOrders(data);
  };
  const {
    isLoading: ordersIsLoading,
    isFetched: ordersIsFetched,
    refetch: recentRefetch,
  } = useGetSellerRecentOrder(onSellerRecentOrderSuccess);
  useTokenRefetch(recentRefetch);
  const {
    data: topProducts,
    isLoading: topIsLoading,
    isFetched,
    refetch: sellerProductRefetch,
  } = useGetSellerTopProducts();
  useTokenRefetch(sellerProductRefetch);
  const [orderStats, setOrderStats] = useState<number[]>([]);
  const onStatSuccess = (data: IMonthlyStats) => {
    if (orderStats.length > 0) return;
    const newData: number[] = [];
    newData.push(data.day1, data.day2, data.day3, data.day4, data.day5, data.day6, data.day7);
    setOrderStats((prevState) => [...prevState, ...newData]);
  };
  const onStoreSuccess = () => { };

  const { data, isFetched: isFetchedStore, refetch: refetchStore, } = useGetStore(onStoreSuccess);
  useTokenRefetch(refetchStore);
  const { isLoading: isStating, refetch } = useGetSellerOrderStats(onStatSuccess);
  useTokenRefetch(refetch);

  return (
    <>
      <Head>
        <title>{t("pagetitle.Shop")}</title>
        <meta
          name={"Store Statistics"}
          content={"These are the stats of your shop"}
        />
        <link rel="icon" href="/favicon-store.ico" />
      </Head>
      <Box >
        <CssBaseline />
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
        <Box
          className="11111"
          sx={{
            // marginTop: 3,
            // marginBottom: 3,
            display: "flex",
            height: !isMobile && "calc(100vh - 35px)",
            p: 2,
            flexDirection: "column",
            // alignItems: 'center',
            justifyContent: "space-around",
          }}
        >
          {
            !isMobile && (
              <>
                <Grid container spacing={2}>
                  <Grid item md={9}>
                    {orderStats.length > 0 && <ShopCard chart={orderStats} />}
                  </Grid>
                  <Grid item md={3}>
                    <Box display={"flex"} flexDirection={"column"} gap={2} height={"100%"}>
                      <ShopOverviewCard 
                        title={stats[4]?.title}
                        value={stats[4]?.value}
                        index={4}
                        height="33%"
                      />
                      <ShopOverviewCard
                        title={stats[3]?.title}
                        value={stats[3]?.value}
                        index={3}
                        height="33%"
                      />
                      <ShopOverviewCard
                        title={stats[2]?.title}
                        value={stats[2]?.value}
                        index={2}
                        height="33%"
                      />
                    </Box>
                  </Grid>
                </Grid>
                <Stack mt={2} display={"flex"} flexDirection={"row"} justifyContent={""} gap={2}>
                  <ShopOverviewCard
                    title={stats[1]?.title}
                    value={stats[1]?.value}
                    index={1}
                    width="50%"
                  />
                  <ShopOverviewCard
                    title={stats[0]?.title}
                    value={stats[0]?.value}
                    index={0}
                    width="50%"
                  />

                </Stack>
              </>
            )
          }
          {
            isMobile && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {orderStats.length > 0 && <ShopCard chart={orderStats} />}
                </Grid>
                <Grid item xs={12}>
                  <ShopOverviewCard
                    title={stats[1]?.title}
                    value={stats[1]?.value}
                    index={1}
                  />
                </Grid>
                <Grid item xs={6}>
                  <ShopOverviewCard
                    title={stats[2]?.title}
                    value={stats[2]?.value}
                    index={2}
                  />
                </Grid>
                <Grid item xs={6}>
                  <ShopOverviewCard
                    title={stats[3]?.title}
                    value={stats[3]?.value}
                    index={3}
                  />
                </Grid>
                <Grid item xs={6}>
                  <ShopOverviewCard
                    title={stats[0]?.title}
                    value={stats[0]?.value}
                    index={0}
                  />
                </Grid>
                <Grid item xs={6}>
                  <ShopOverviewCard 
                    title={t("seller.store_stats.Customers")}
                    value={0}
                    index={4}
                  />
                </Grid>
              </Grid>
            )
          }
          {topIsLoading && <CircularProgress />}
        </Box>
      </Box>
    </>
  );
};
export default Shop;
