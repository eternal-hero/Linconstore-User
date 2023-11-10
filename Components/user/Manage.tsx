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

const Manage: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <>
      {isMobile ? <GenNav admin={false} mode={false} /> : <Nav />}
      <Card elevation={0} sx={{ borderRadius: "0px" }}>
        <Wrapper
          title={t("pagetitle.Manage_Devices")}
          description={"This is where you manage your devices "}
          content={"Manage your devices"}
        >
          <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
            <Stack direction={"row"}>
              <ArrowBack onClick={() => router.back()} className={"pointer"} />
              <Typography variant={"body1"}>
                {t("account.manage.back")}
              </Typography>
            </Stack>
            <Container
              component={"article"}
              maxWidth={"md"}
              sx={{ p: isMobile ? 1 : 4 }}
            >
              <Typography variant={isMobile ? "body1" : "h5"}>
                {t("account.manage.title")}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  p: isMobile ? 1 : 2,
                  justifyContent: "center",
                }}
              >
                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    p: isMobile ? 1 : 2,
                    justifyContent: "space-between",
                  }}
                >
                  <Stack>
                    <Typography variant={isMobile ? "body1" : "h6"}>
                      {" "}
                      {t("account.manage.item1")}{" "}
                    </Typography>
                    <Typography variant={"caption"}>
                      {t("account.manage.status1")}
                    </Typography>
                  </Stack>
                  <Button
                    variant={"outlined"}
                    size={"small"}
                    color={"inherit"}
                    sx={{
                      color: "red",
                      border: "red !important",
                      textTransform: "none",
                      maxHeight: "40px",
                    }}
                  >
                    {t("account.manage.handle1")}
                  </Button>
                </Stack>
                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    p: 2,
                    justifyContent: "space-between",
                  }}
                >
                  <Stack>
                    <Typography variant={isMobile ? "body1" : "h6"}>
                      {" "}
                      {t("account.manage.item2")}{" "}
                    </Typography>
                    <Typography variant={"caption"}>
                      {t("account.manage.status2")}
                    </Typography>
                  </Stack>
                  <Button
                    variant={"outlined"}
                    color={"inherit"}
                    size={"small"}
                    sx={{
                      color: "red",
                      border: "0px !important",
                      textTransform: "none",
                      maxHeight: "40px",
                    }}
                  >
                    {t("account.manage.handle2")}
                  </Button>
                </Stack>
              </Box>
            </Container>
          </Box>
        </Wrapper>
      </Card>
      <Footer />
    </>
  );
};
export default Manage;
