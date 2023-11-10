import React, { useState } from "react";
import { Container } from "@mui/system";
import Box from "@mui/material/Box";
import {
  Button,
  Card,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import UserOrders from "../Utils/UserOrders";
import GenNav from "../Layouts/GenNav";
import Nav from "../Layouts/Nav";
import { IOrders, IVariants, TProducts } from "../../Helpers/Types";
import { useCancelledOrder, useProcessedOrder } from "../../hooks/useDataFetch";
import { useTranslation } from "react-i18next";
import Image from 'next/image';

const OrderProcessed: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isMatches = useMediaQuery("(max-width: 800px)");
  const [products, setProducts] = useState<IOrders[]>([]);
  const onSuccess = (data: any) => {
    setProducts(data.order);
  };

  const { data, isLoading, isFetched } = useProcessedOrder(onSuccess);
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <>
      {isMobile ? <GenNav admin={false} mode={false} /> : <Nav />}
      <Card elevation={0} sx={{ borderRadius: "0px" }}>
        <Wrapper
          title={t("pagetitle.Orders_Processed")}
          description={"You can find your Processed Orders here "}
          content={""}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              p: isMobile ? 1 : 2,
            }}
          >
            <Stack direction={"row"} alignItems={"center"}>
              <Stack direction={"row"} alignItems={"center"} gap={2}>
                <ArrowBack
                  onClick={() => router.back()}
                  className={"pointer"}
                  sx={{ color: "#0ba659" }}
                />
                <Typography
                  variant={"h5"}
                  fontSize={15}
                  textAlign={"center"}
                >
                  {t("account.order_process.title")}
                </Typography>
              </Stack>
            </Stack>

            <Container
              component={"article"}
              maxWidth={"lg"}
              sx={{ m: isMobile ? "0 !important" : "4" }}
            >
              {isFetched && products.length === 0 && (
                <>
                  <Grid container spacing={2} height={isMobile ? "calc(100vh - 130px)" : "calc(100vh - 90px)"}>
                    <Grid item xs={12} sm={6} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                      <Image
                        width={isMobile ? 250 : 350}
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
                          {t("account.order_process.content")}
                        </Typography>
                        <Button variant="contained" onClick={() => router.push('/')}>
                          Shop Now
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </>
              )}
              {isFetched && products.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    p: isMobile ? 0 : 2,
                    justifyContent: "center",
                    marginTop: "16px",
                    margin: "auto",
                  }}
                >
                  <Grid container direction={"column"}>
                    {products.map((data, index) => {
                      if (data.productId?.title) {
                        return (
                          <Grid key={index} item xs={4} sm={4} lg={2}>
                            <UserOrders
                              order={data}
                              user=""
                              value={String(index)}
                            />
                          </Grid>
                        );
                      }
                    })}
                  </Grid>
                </Box>
              )}
            </Container>
          </Box>
        </Wrapper>
      </Card>
    </>
  );
};
export default OrderProcessed;
