import React from "react";
import { Container } from "@mui/system";
import { Card, Stack, Typography, useMediaQuery } from "@mui/material";
import { Gavel } from "@mui/icons-material";
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import Nav from "../Layouts/Nav";
import { useTranslation } from "react-i18next";
import ContentHeader from "../Utils/contentHeader";
import Footer from "../Layouts/Footer";

const Terms: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <>
      <Nav />
      <Card elevation={0} sx={{ borderRadius: "0px" }}>
        <Wrapper
          title={t("pagetitle.Terms_and_Condition")}
          description={"This is the terms and condition of use page"}
          content={"Terms and condition of use linconstore"}
        >
          <ContentHeader
            title={t("term.title")}
            paths={[t("term.home"), t("footer.Terms")]}
            iconComponent={<Gavel sx={{color: "var(--primary)"}} />}
            routePath="/"
          />
          <Container component={"main"} maxWidth={"lg"} sx={{py: 5}}>
            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("term.ques1")}
              </Typography>
              <Typography variant={"body1"}>{t("term.ans1_1")}</Typography>

              <Typography variant={"body1"}>{t("term.ans1_2")}</Typography>

              <Typography variant={"body1"}>{t("term.ans1_3")}</Typography>
            </Stack>
            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("term.ques2")}
              </Typography>

              <Typography variant={"body1"}>
                {t("term.ans2_1")}
                <Container component={"article"}>
                  <Typography variant={"body1"}>
                    {t("term.ans2_1_1")}
                  </Typography>
                  <Typography variant={"body1"}>
                    {t("term.ans2_1_2")}
                  </Typography>
                  <Typography variant={"body1"}>
                    {t("term.ans2_1_3")}
                  </Typography>
                </Container>
              </Typography>
              <Typography variant={"body1"}>{t("term.ans2_2")}</Typography>
              <Typography variant={"body1"}>{t("term.ans2_3")}</Typography>
              <Typography variant={"body1"}>{t("term.ans2_4")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("term.ques3")}
              </Typography>

              <Typography variant={"body1"}>{t("term.ans3_1")}</Typography>
              <Typography variant={"body1"}>{t("term.ans3_2")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("term.ques4")}
              </Typography>

              <Typography variant={"body1"}>{t("term.ans4_1")}</Typography>
              <Typography variant={"body1"}>{t("term.ans4_2")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("term.ques5")}
              </Typography>

              <Typography variant={"body1"}>{t("term.ans5_1")}</Typography>
              <Typography variant={"body1"}>{t("term.ans5_2")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("term.ques6")}
              </Typography>

              <Typography variant={"body1"}>{t("term.ans6_1")}</Typography>
              <Typography variant={"body1"}>{t("term.ans6_2")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("term.ques7")}
              </Typography>

              <Typography variant={"body1"}>{t("term.ans7_1")}</Typography>
              <Typography variant={"body1"}>{t("term.ans7_2")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("term.ques8")}
              </Typography>

              <Typography variant={"body1"}>{t("term.ans8_1")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("term.ques9")}
              </Typography>

              <Typography variant={"body1"}>{t("term.ans9_1")}</Typography>
              <Container component={"article"}>
                <Typography variant={"body1"}>{t("term.ans9_1_a")}</Typography>
                <Typography variant={"body1"}>{t("term.ans9_1_b")}</Typography>
                <Typography variant={"body1"}>{t("term.ans9_1_c")}</Typography>
                <Typography variant={"body1"}>{t("term.ans9_1_d")}</Typography>
                <Typography variant={"body1"}>{t("term.ans9_1_e")}</Typography>
                <Typography variant={"body1"}>{t("term.ans9_1_f")}</Typography>
                <Typography variant={"body1"}>{t("term.ans9_1_g")}</Typography>
                <Typography variant={"body1"}>{t("term.ans9_1_h")}</Typography>
                <Typography variant={"body1"}>{t("term.ans9_1_i")}</Typography>
              </Container>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("term.ques10")}
              </Typography>

              <Typography variant={"body1"}>{t("term.ans10_1")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("term.ques11")}
              </Typography>

              <Typography variant={"body1"}>{t("term.ans11_1")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("term.ques12")}
              </Typography>

              <Typography variant={"body1"}>{t("term.ans12_1")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("term.ques13")}
              </Typography>

              <Typography variant={"body1"}>{t("term.ans13_1")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("term.ques14")}
              </Typography>

              <Typography variant={"body1"}>{t("term.ans14_1")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("term.ques15")}
              </Typography>

              <Typography variant={"body1"}>{t("term.ans15_1")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("term.ques16")}
              </Typography>

              <Typography variant={"body1"}>{t("term.ans16_1")}</Typography>
              <Typography variant={"body1"}>{t("term.ans16_2")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("term.ques17")}
              </Typography>

              <Typography variant={"body1"}>{t("term.ans17_1")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("term.ques18")}
              </Typography>

              <Typography variant={"body1"}>{t("term.ans18_1")}</Typography>
              <Typography variant={"body1"}>{t("term.date")}</Typography>
            </Stack>
          </Container>

          <Footer />
        </Wrapper>
      </Card>
    </>
  );
};
export default Terms;
