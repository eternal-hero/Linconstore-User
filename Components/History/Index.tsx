import React from "react";
import { Container } from "@mui/system";
import Box from "@mui/material/Box";
import { Card, Stack, Typography, useMediaQuery } from "@mui/material";
import Button from "@mui/material/Button";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import GenNav from "../Layouts/GenNav";
import Nav from "../Layouts/Nav";
import Footer from "../Layouts/Footer";
import { useTranslation } from "react-i18next";

const History: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <>
      {isMobile ? <GenNav admin={false} mode={false} /> : <Nav />}
      <Card elevation={0} sx={{ borderRadius: "0px" }}>
        <Wrapper
          title={t("pagetitle.History")}
          description={"This is where you find your browser history"}
          content={"Get your browsing history"}
        >
          <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
            <Stack direction={"row"}>
              <ArrowBack
                onClick={() => router.push("/")}
                className={"pointer"}
              />
              <Typography variant={"body1"}>{t("history.home")}</Typography>
            </Stack>
            <Container component={"article"} maxWidth={"lg"}>
              <Box sx={{ borderBottom: "0px !important", p: 1, maxWidth: 600 }}>
                <Stack direction={"row"} spacing={4}>
                  <Typography variant={isMobile ? "body1" : "h5"}>
                    <b>{t("history.title")}</b>
                  </Typography>
                  <Button
                    variant={"outlined"}
                    color={"inherit"}
                    sx={{ border: "0px !important" }}
                  >
                    {t("history.clearBtn")}
                  </Button>
                </Stack>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    p: 2,
                    justifyContent: "center",
                  }}
                >
                  <Typography variant={"body1"} sx={{ my: 2 }}>
                    {t("history.item1")}
                  </Typography>
                  <Typography variant={"body1"} sx={{ my: 2 }}>
                    {t("history.item2")}
                  </Typography>
                  <Typography variant={"body1"} sx={{ my: 2 }}>
                    {t("history.item3")}
                  </Typography>
                  <Typography variant={"body1"} sx={{ my: 2 }}>
                    {t("history.item4")}
                  </Typography>
                  <Typography variant={"body1"} sx={{ my: 2 }}>
                    {t("history.item5")}
                  </Typography>
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
export default History;
