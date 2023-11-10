import React from "react";
import { Container } from "@mui/system";
import { Card, Stack, Typography, useMediaQuery } from "@mui/material";
import { Policy } from "@mui/icons-material";
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import Nav from "../Layouts/Nav";
import { useTranslation } from "react-i18next";
import ContentHeader from "../Utils/contentHeader";
import Footer from "../Layouts/Footer";

const Privacy: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <>
      <Nav />
      <Card elevation={0} sx={{ borderRadius: "0px" }}>
        <Wrapper
          title={t("pagetitle.Privacy_Policy")}
          description={"Learn how your data is collected, stored and used on Linconstore"}
          content={"Information we collect and how it is used"}
        >
          <ContentHeader 
            title={t("privacy.title")}
            paths={[t("privacy.home"), t("privacy.title")]}
            iconComponent={<Policy sx={{color: "var(--primary)"}}/>}
            routePath="/"
          />
          <Container component={"main"} maxWidth={"lg"} sx={{py: 5}}>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={"body1"}>{t("privacy.content1")}</Typography>

              <Typography variant={"body1"}>{t("privacy.content2")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("privacy.ques1")}
              </Typography>

              <Typography variant={"body1"}>{t("privacy.ans1_1")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans1_2")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("privacy.ques2")}
              </Typography>

              <Typography variant={"body1"}>{t("privacy.ans2_1")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans2_2")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans2_3")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans2_4")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans2_5")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans2_6")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans2_7")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans2_8")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans2_9")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans2_10")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("privacy.ques3")}
              </Typography>

              <Typography variant={"body1"}>{t("privacy.ans3_1")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans3_2")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("privacy.ques4")}
              </Typography>

              <Typography variant={"body1"}>{t("privacy.ans4_1")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans4_2")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans4_3")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans4_4")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans4_5")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans4_6")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans4_7")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans4_8")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans4_9")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans4_10")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans4_11")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans4_12")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans4_13")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans4_14")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans4_15")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans4_16")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans4_17")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans4_18")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans4_19")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans4_20")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("privacy.ques5")}
              </Typography>

              <Typography variant={"body1"}>{t("privacy.ans5_1")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans5_2")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans5_3")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("privacy.ques6")}
              </Typography>

              <Typography variant={"body1"}>{t("privacy.ans6_1")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("privacy.ques7")}
              </Typography>

              <Typography variant={"body1"}>{t("privacy.ans7_1")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans7_2")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans7_3")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("privacy.ques8")}
              </Typography>

              <Typography variant={"body1"}>{t("privacy.ans8_1")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans8_2")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("privacy.ques9")}
              </Typography>

              <Typography variant={"body1"}>{t("privacy.ans9_1")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("privacy.ques10")}
              </Typography>

              <Typography variant={"body1"}>{t("privacy.ans10_1")}</Typography>
              <Container component={"article"}>
                <Typography variant={"body1"}>
                  {t("privacy.ans10_2")}
                </Typography>
                <Typography variant={"body1"}>
                  {t("privacy.ans10_3")}
                </Typography>
                <Typography variant={"body1"}>
                  {t("privacy.ans10_4")}
                </Typography>
                <Typography variant={"body1"}>
                  {t("privacy.ans10_5")}
                </Typography>
                <Typography variant={"body1"}>
                  {t("privacy.ans10_6")}
                </Typography>
                <Typography variant={"body1"}>
                  {t("privacy.ans10_7")}
                </Typography>
                <Typography variant={"body1"}>
                  {t("privacy.ans10_8")}
                </Typography>
                <Typography variant={"body1"}>
                  {t("privacy.ans10_9")}
                </Typography>
              </Container>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("privacy.ques11")}
              </Typography>
              <Typography variant={"body1"}>{t("privacy.ans11_1")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans11_2")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans11_3")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("privacy.ques12")}
              </Typography>

              <Typography variant={"body1"}>{t("privacy.ans12_1")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans12_2")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("privacy.ques13")}
              </Typography>

              <Typography variant={"body1"}>{t("privacy.ans13_1")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans13_2")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("privacy.ques14")}
              </Typography>

              <Typography variant={"body1"}>{t("privacy.ans14_1")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("privacy.ques15")}
              </Typography>

              <Typography variant={"body1"}>{t("privacy.ans15_1")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("privacy.ques16")}
              </Typography>

              <Typography variant={"body1"}>{t("privacy.ans16_1")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans16_2")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("privacy.ques17")}
              </Typography>

              <Typography variant={"body1"}>{t("privacy.ans17_1")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("privacy.ques18")}
              </Typography>

              <Typography variant={"body1"}>{t("privacy.ans18_1")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("privacy.ques19")}
              </Typography>

              <Typography variant={"body1"}>{t("privacy.ans19_1")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans19_2")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans19_3")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("privacy.ques20")}
              </Typography>

              <Typography variant={"body1"}>{t("privacy.ans20_1")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("privacy.ques21")}
              </Typography>

              <Typography variant={"body1"}>{t("privacy.ans21_1")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans21_2")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("privacy.ques22")}
              </Typography>

              <Typography variant={"body1"}>{t("privacy.ans22_1")}</Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("privacy.ques23")}
              </Typography>

              <Typography variant={"body1"}></Typography>
              <Typography variant={"body1"}>{t("privacy.ans23_1")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans23_2")}</Typography>
              <Typography variant={"body1"}>{t("privacy.ans23_3")}</Typography>
            </Stack>
          </Container>

          <Footer />
        </Wrapper>
      </Card>
    </>
  );
};
export default Privacy;
