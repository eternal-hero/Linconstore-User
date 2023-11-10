import React from "react";
import { Container } from "@mui/system";
import { Card, Grid, Stack, Typography, useMediaQuery } from "@mui/material";
import { Person } from "@mui/icons-material";
import Wrapper from "../Wappers/Container";
import Nav from "../Layouts/Nav";
import { useTranslation } from "react-i18next";
import ContentHeader from "../Utils/contentHeader";
import Footer from "../Layouts/Footer";

const About: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const { t } = useTranslation();

  return (
    <>
      <Nav />
      <Card elevation={0} sx={{ borderRadius: "0px" }}>
        <Wrapper
          title={t("pagetitle.About_us")}
          description={"Learn about our values and core principles"}
          content={"Learn about linconstore values here"}
        >
          <ContentHeader
            title={t("about.Title")}
            paths={[t("about.ArrowBackTitle"), t("about.Title")]}
            iconComponent={<Person sx={{color: "var(--primary)"}} />}
            routePath="/"
          />
          <Container component={"main"} maxWidth={"lg"} sx={{py: 5}}>
            <Stack spacing={2} sx={{ my: 3 }}>
              <Typography variant={"body1"}>
                {t("about.content0")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 3 }}>
              <Typography variant={isMobile ? "h6" : "h6"} color={"var(--primary)"}>
                {t("about.Our_Goals")}
              </Typography>

              <Typography variant={"body1"}>
                {t("about.content1")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 3 }}>
              <Typography variant={isMobile ? "h6" : "h6"} color={"var(--primary)"}>
                {t("about.Our_Vision")}
              </Typography>

              <Typography variant={"body1"}>
                {t("about.content2")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 3 }}>
              <Typography variant={isMobile ? "h6" : "h6"} color={"var(--primary)"}>
                {t("about.What_Sets_Us_Apart")}
              </Typography>

              <Typography variant={"body1"}>
                {t("about.content3-1")}
              </Typography>
              <Typography variant={"body1"}>
                {t("about.content3-2")}
              </Typography>
              <Typography variant={"body1"}>
                {t("about.content3-3")}
              </Typography>
              <Typography variant={"body1"}>
                {t("about.content3-4")}
              </Typography>
              <Typography variant={"body1"}>
                {t("about.content3-5")}
              </Typography>
            </Stack>
          </Container>

          <Footer />
        </Wrapper>
      </Card>
    </>
  );
};
export default About;
