import React from "react";
import { Container } from "@mui/system";
import Box from "@mui/material/Box";
import {
  Card,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import SellersCards from "../Utils/SellersCards";
import GenNav from "../Layouts/GenNav";
import Nav from "../Layouts/Nav";
import Footer from "../Layouts/Footer";
import { t } from "i18next";

const Interest: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  return (
    <>
      {isMobile ? <GenNav mode={false} admin={false} /> : <Nav />}
      <Card elevation={0} sx={{ borderRadius: "0px" }}>
        <Wrapper title={t("pagetitle.Saved_Interest")} description={"Interest"} content={""}>
          <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
            <Stack direction={"row"}>
              <ArrowBack onClick={() => router.back()} className={"pointer"} />
              <Typography variant={"body1"}> Back </Typography>
            </Stack>
            <Container
              component={"article"}
              maxWidth={"lg"}
              sx={{ p: isMobile ? 1 : 4 }}
            >
              <Box sx={{ maxWidth: 600 }}>
                <Typography variant={isMobile ? "body1" : "h5"} sx={{ p: 2 }}>
                  Saved Interest{" "}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    p: isMobile ? 0.3 : 2,
                    justifyContent: "center",
                  }}
                >
                  <Grid container>
                    {[1].map((data, index) => (
                      <Grid
                        key={index}
                        item
                        xs={12}
                        sm={4}
                        lg={2}
                        sx={{ minWidth: 230 }}
                      >
                        <SellersCards
                          image={
                            "https://as1.ftcdn.net/v2/jpg/05/07/18/62/1000_F_507186213_2xdYcp8tk53bWAwTSAFFpBDS3Mlhm8Xm.jpg"
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
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
export default Interest;
