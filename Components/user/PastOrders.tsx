import React, { useEffect, useState } from "react";
import { Container } from "@mui/system";
import Box from "@mui/material/Box";
import { Button, Card, Grid, Stack, Typography, useMediaQuery } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import UserOrders from "../Utils/UserOrders";
import GenNav from "../Layouts/GenNav";
import Nav from "../Layouts/Nav";
import {useGetUserOrders, useGetUserOrdersShipped} from "../../hooks/useDataFetch";
import { IOrders } from "../../Helpers/Types";
import { useTranslation } from "react-i18next";
import { useTokenRefetch } from "../../hooks/useRefresh";
import {useSelector} from "react-redux";
import Image from 'next/image';


let isFirst = false;


type TOrders = {
  user: string,
  order: IOrders[],
  value: string
}
const PastOrders: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const { t } = useTranslation();
  const [orders, setOrders] = useState<IOrders[]>([]);
  const [user, setUser] = useState<string>('')

  const onSuccess = (data: TOrders) => {
    setOrders(data.order);
    setUser(data.user)
  };
  const {isFetched , refetch} = useGetUserOrdersShipped(onSuccess);
  interface modal {
    modal : {
      addRatingModal : boolean
    }
  }
  const isUpdating : boolean = useSelector((state: modal) => state.modal.addRatingModal);

  useTokenRefetch(refetch)
  useEffect(() => {
    setTimeout(() => {
      isFirst = true;
    },300)
  },[])
  useEffect(() => {
     if (isFirst) {
       refetch()
     }
  }, [isUpdating])
  return (
    <>
      {isMobile ? <GenNav admin={false} mode={false} /> : <Nav />}
      <Card elevation={0} sx={{ borderRadius: "0px" }}>
        <Wrapper
          title={t("pagetitle.PastOrders")}
          description={"You can find your past Orders here "}
          content={""}
        >
          <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
            <Stack direction={"row"} alignItems={"center"}>
              <Stack direction={"row"} alignItems={"center"} gap={2}>
                <ArrowBack
                  onClick={() => router.back()}
                  className={"pointer"}
                  sx={{color: "#0ba659"}}
                />
                <Typography
                  variant={"h5"}
                  fontSize={15}
                  textAlign={"center"}
                >
                  {t("account.past_order.title")}
                </Typography>
              </Stack>
            </Stack>
            <Container component={"article"} maxWidth={"lg"}>
              {isFetched && orders.length === 0 && (
                <>
                  <Grid container spacing={2} height={ isMobile ? "calc(100vh - 150px)" : "calc(100vh - 90px)"}>
                    <Grid item xs={12} sm={6} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                      <Image
                        width={ isMobile ? 250 : 350}
                        height={isMobile ? 250 : 350}
                        style={{ marginTop: 30, width: "100%", height: "100%" }}
                        placeholder="blur"
                        blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
                        src={"https://res.cloudinary.com/linconstore-cloud/image/upload/f_auto,q_auto/v1/web-asset/igqk3oaoh6q2p2ogvt5f"}
                        alt={"image of Happy"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} display={"flex"} alignItems={"center"} justifyContent={"center"} px={2}>
                      <Stack textAlign={"center"} gap={3}>
                        <Typography variant={"body1"}>
                          {t("account.past_order.content")}
                        </Typography>
                        <Button variant="contained" onClick={() => router.push('/')}>
                          Shop Now
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </>
              )}
              {
                isFetched && orders.length > 0 && (
                  // <Box sx={{
                  //     display: 'flex',
                  //     flexDirection: 'column',
                  //     p: isMobile ? 0.2 : 2,
                  //     justifyContent: 'center',
                  //     maxWidth: '500px',
                  //     border: isMobile ? '0px' : '2px solid black'
                  // }}>
                  <Grid container direction={"column"}>
                    {orders.map((order, index) => {
                      if (order.productId?.title) {
                        return (
                          <Grid key={index} item xs={6} sm={4} lg={2}>
                            <UserOrders
                              user={user}
                              order={order}
                              value={String(index)}
                            />
                          </Grid>
                        );
                      }
                    })}
                  </Grid>
                )
                // </Box>
              }
            </Container>
          </Box>
        </Wrapper>
      </Card>
    </>
  );
};
export default PastOrders;
