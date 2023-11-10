import React, { useState } from "react";
import { Container } from "@mui/system";
import Box from "@mui/material/Box";
import {
  Card,
  CircularProgress,
  Grid,
  Stack,
  Switch,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import ProductCards from "../Utils/ProductCards";
import SellersCards from "../Utils/SellersCards";
import GenNav from "../Layouts/GenNav";
import Nav from "../Layouts/Nav";
import Footer from "../Layouts/Footer";
import { TProducts, TSellerStore, TStoreId } from "../../Helpers/Types";
import { useGetUserRecommendation } from "../../hooks/useDataFetch";
import { useTranslation } from "react-i18next";

interface IData {
  stores: TStoreId[];
  products: TProducts[];
}
const Recommendation: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const { t } = useTranslation();

  const [products, setProducts] = useState<TProducts[]>([]);
  const [stores, setStore] = useState<TStoreId[]>([]);
  const onSuccess = (data: IData) => {
    setProducts(data.products);
    setStore(data.stores);
  };
  const { isLoading, data, isFetched } = useGetUserRecommendation(onSuccess);
  return (
    <>
      {isMobile ? <GenNav admin={false} mode={false} /> : <Nav />}
      <Card elevation={0} sx={{ borderRadius: "0px" }}>
        <Wrapper
          title={t("pagetitle.Recommendation")}
          description={"You can find recommendation here "}
          content={""}
        >
          <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
            <Stack direction={"row"}>
              <ArrowBack onClick={() => router.back()} className={"pointer"} />
              <Typography variant={"body1"}>
                {t("account.recommendation.back")}
              </Typography>
            </Stack>

            <Container component={"article"} maxWidth={"lg"}>
              <Box sx={{ p: 1, maxWidth: 600 }}>
                <Typography variant={isMobile ? "body1" : "h5"}>
                  {t("account.recommendation.title")}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    p: isMobile ? 0 : 2,
                    justifyContent: "center",
                  }}
                >
                  <Typography variant={isMobile ? "body1" : "h6"}>
                    {t("account.recommendation.item1")}{" "}
                    {isLoading && <CircularProgress />}
                  </Typography>
                  {isFetched && stores.length === 0 && (
                    <Typography variant={"h6"} textAlign={"center"}>
                      {t("account.recommendation.empty_content")}
                    </Typography>
                  )}
                  {stores.length > 0 && (
                    <Grid container>
                      {stores.map((data, index) => (
                        <Grid
                          key={index}
                          item
                          xs={6}
                          sm={4}
                          lg={2}
                          sx={{ minWidth: 230 }}
                        >
                          <SellersCards image={data.logo} />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                  <Typography variant={isMobile ? "body1" : "h6"}>
                    {t("account.recommendation.item2")}
                  </Typography>
                  {/* {products.length > 0 &&
                                    <Grid container>
                                        {products.map((data,  index)=> (
                                            <Grid key={index} item xs={12} sm={4} lg={2} >
                                                <ProductCards  owner={data.owner} discount={false} name={data.title} image={data.photo} price={data.price} rating={0}
                                                            id={data._id} />
                                            </Grid>
                                        ))}
                                    </Grid>
                                    } */}
                </Box>
              </Box>
            </Container>
          </Box>
        </Wrapper>
      </Card>
      <Footer />
    </>
  );
};
export default Recommendation;
