import React from "react";
import { Container } from "@mui/system";
import Box from "@mui/material/Box";
import { Card, Stack, Typography, useMediaQuery } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import GenNav from "../Layouts/GenNav";
import Nav from "../Layouts/Nav";
import Footer from "../Layouts/Footer";
import { useTranslation } from "react-i18next";

const Work: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <>
      {isMobile ? <GenNav admin={false} mode={false} /> : <Nav />}
      <Card elevation={0} sx={{ borderRadius: "0px" }}>
        <Wrapper
          title={t("pagetitle.Work_with")}
          description={"This is work with us page"}
          content={"Explore this page to find job opportunities"}
        >
          <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
            <Stack direction={"row"}>
              <ArrowBack
                onClick={() => router.push("/")}
                className={"pointer"}
              />
              <Typography variant={"body1"}> {t("work.home")} </Typography>
            </Stack>
            <Stack spacing={2}>
              <Typography
                variant={isMobile ? "h6" : "h1"}
                textAlign={"center"}
                sx={{ fontSize: "1.5rem", fontWeight: "600" }}
              >
                {t("work.title")}
              </Typography>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("work.subtitle1")}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Container component={"article"}>
                  <Typography variant={"body2"}>
                    {t("work.content1")}
                  </Typography>
                </Container>
                <Stack
                  my={3}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant={isMobile ? "h6" : "h6"}>
                    {t("work.subtitle2")}
                  </Typography>
                  <Container component={"article"}>
                    <Typography sx={{ mt: 2 }} variant={"body2"}>
                      {t("work.content2")}
                    </Typography>
                  </Container>
                </Stack>
                <Stack>
                  <Typography variant={"h6"}>{t("work.subtitle3")}</Typography>
                  <Container component={"article"}>
                    <Typography variant={"body2"}>
                      {t("work.content3")}
                    </Typography>
                  </Container>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Wrapper>
      </Card>
      <Footer />
    </>
  );
};
export default Work;
