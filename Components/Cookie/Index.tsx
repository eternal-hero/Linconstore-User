import React from "react";
import { Card, Container, Stack, Typography, useMediaQuery } from "@mui/material";
import CookieIcon from '@mui/icons-material/Cookie';
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import Nav from "../Layouts/Nav";
import { useTranslation } from "react-i18next";
import ContentHeader from "../Utils/contentHeader";
import Footer from "../Layouts/Footer";

const Cookie: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <>
      <Nav />
      <Card elevation={0} sx={{ borderRadius: "0px" }}>
        <Wrapper
          title={t("pagetitle.Cookie_policy")}
          description={"Learn what cookies we use when you visit linconstore"}
          content={"cookie policy page | linconstore"}
        >
          <ContentHeader 
            title={t("cookie_policy.title")}
            paths={[t("cookie_policy.home"), t("footer.Cookie")]}
            routePath="/"
            iconComponent={<CookieIcon sx={{color: "var(--primary)"}}  />}
          />
          <Container component={"main"} maxWidth={"lg"} sx={{py: 5}}>            

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={"body1"}>
                {t("cookie_policy.content")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("cookie_policy.ques1")}
              </Typography>

              <Typography variant={"body1"}>
                {t("cookie_policy.ans1")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("cookie_policy.ques2")}
              </Typography>

              <Typography variant={"body1"}>
                {t("cookie_policy.ans2_1")}
              </Typography>
              <Typography variant={"body1"}>
                {t("cookie_policy.ans2_2")}
              </Typography>
              <Typography variant={"body1"}>
                {t("cookie_policy.ans2_3")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("cookie_policy.ques3")}
              </Typography>

              <Typography variant={"body1"}>
                {t("cookie_policy.ans3_1")}
              </Typography>
              <Typography variant={"body1"}>
                {t("cookie_policy.ans3_2")}
              </Typography>
              <Typography variant={"body1"}>
                {t("cookie_policy.ans3_3")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={"body1"}>
                {t("cookie_policy.date")}
              </Typography>
            </Stack>
          </Container>

          <Footer/>
        </Wrapper>
      </Card>
    </>
  );
};
export default Cookie;
