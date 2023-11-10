import {
  CssBaseline,
  Grid,
  IconButton,
  Paper,
  Stack,
  createTheme,
  Typography,
  useMediaQuery,
  Divider,
} from "@mui/material";
import {
  Instagram,
  Facebook,
  LinkedIn,
  YouTube,
  Twitter,
} from "@mui/icons-material";
import { Box, Container } from "@mui/system";
import Link from "next/link";
import React, { useContext, useEffect } from "react";
import Image from "next/image";
import ContextApi from "../../Store/context/ContextApi";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { css } from "@emotion/react";
import Cookies from "js-cookie";
import LanguageSelect from "../../Components/LanguageSelect";

const gridItemStyles = css`
  width: 7%; /* Initial width: 7 */

  @media (max-width: 600px) {
    width: 100%; /* Width: 100 */
  }
`;

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});
const Footer: React.FC = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobileFooter: boolean = useMediaQuery("(max-width : 400px)");
  const isLoggedIn = useContext(ContextApi).isLoggedIn;
  const router = useRouter();
  const role = useContext(ContextApi).role;
  const { t } = useTranslation();
  const handleRoute = () => {
    if (!isLoggedIn) return router.push("/login");
    const isCompleted = Cookies.get("completed");
    // const isCompleted = localStorage.getItem("completed");
    if (isCompleted) return;
    if (role === "seller") {
      const seller = Cookies.get("seller");
      if (seller === "true") {
        return router.push("/seller/exist");
      }
      return router.push("/seller/permission");
    }
    router.push("/seller/verify");
  };
  const handleRouter = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <Paper
      sx={{ background: "#fbfbfb", p: 3, color: "#ffffff" }}
      className="footerMain"
    >
      <Container maxWidth={false} component={"main"}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            // m: { xs: isMobileFooter ? 0 : 1, sm: 2, md: 0, lg: 0, xl: 6 },
            flexDirection: "row",
            mb: 2,
            justifyContent: "space-around",
          }}
        >
          <Grid container sx={{ display: "flex", flexDirection: "row" }}>
            <Grid item xs={isMobile ? 12 : 7} sm={6} md={5}>
              <Image
                src="https://res.cloudinary.com/linconstore-cloud/image/upload/f_auto,q_auto/v1/web-asset/y91radan7dkpnwlicnws"
                placeholder="blur"
                blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
                className="footer_logo"
                priority={true}
                width={isMobile ? 100 : 120}
                height={isMobile ? 75 : 95}
                alt={"pictures on footer"}
              />

              <Stack spacing={1}>
                <Typography sx={{ fontSize: "15px", color: "black" }} variant="body2">
                  {t("footer.CompanyNo")}
                </Typography>
              </Stack>

              <Box>
                <Stack
                  direction={"row"}
                  sx={{ display: "flex", flexDirection: "row", gap: 0.5 }}
                >
                  <IconButton
                    size={"small"}
                    onClick={() =>
                      handleRouter("https://facebook.com/linconstore")
                    }
                  >
                    <Twitter className="icon-green" />
                  </IconButton>
                  <IconButton
                    size={"small"}
                    onClick={() =>
                      handleRouter("https://facebook.com/linconstore")
                    }
                  >
                    <Facebook className="icon-green" />
                  </IconButton>
                  <IconButton
                    size={"small"}
                    onClick={() =>
                      handleRouter("https://instagram.com/linconstoreltd")
                    }
                  >
                    <Instagram className="icon-green" />
                  </IconButton>
                  <IconButton
                    size={"small"}
                    onClick={() =>
                      handleRouter(
                        "https://twitter.com/linconstore?t=cY9nfR0DBzQF3KEyCGp4wg&s=09"
                      )
                    }
                  >
                    <LinkedIn className="icon-green" />
                  </IconButton>
                  <IconButton
                    size={"small"}
                    onClick={() =>
                      handleRouter("https://youtube.com/@linconstore")
                    }
                  >
                    <YouTube className="icon-green" />
                  </IconButton>
                </Stack>
              </Box>
            </Grid>
            <Grid
              item
              className="gridItemStyles"
              sm={6}
              md={7}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "column", md: "row" },
                justifyContent: "space-between",
              }}
            >
              <Stack spacing={1} sx={{mb: isMobile?3:1, mt: isMobile?2:1}}>
                <Typography variant="h6" sx={{ color: "#101010", fontSize: 16 }}>
                  {t("footer.CompanyTitle")}
                </Typography>
                <Typography sx={{ fontSize: "15px", color: "black" }} variant="body2">
                  <Link href={"/about"}>
                    <a href={"/about"}>{t("footer.CompanyAbout")}</a>
                  </Link>
                </Typography>
                <Typography sx={{ fontSize: "15px", color: "black", mb: 3 }} variant="body2">
                  <Link href={"#"}>
                    <a href={"#"} className="disabled-link">{t("footer.NewsRoom")}</a>
                  </Link>
                </Typography>
              </Stack>
              <Stack spacing={1} sx={{mb: isMobile?3:1}}>
                <Typography variant="h6" sx={{ color: "#101010", fontSize: 16 }}>
                  {t("footer.OpportunityTitle")}
                </Typography>
                <Typography sx={{ fontSize: "15px", color: "black" }} variant="body2">
                  <Link href="#">
                    <a href={"#"} className="disabled-link">{t("footer.Ads_space")}</a>
                  </Link>
                </Typography>
                <Typography sx={{ fontSize: "15px", color: "black" }} variant="body2">
                  <Link href="/work">
                    <a href={"/work"}>{t("footer.Careers")}</a>
                  </Link>
                </Typography>
                <Typography
                  onClick={handleRoute}
                  sx={{ fontSize: "15px", color: "black", cursor: "pointer" }}
                  variant="body2"
                >
                  {t("footer.Sell")}
                </Typography>
              </Stack>
              <Stack spacing={1} sx={{mb: isMobile?3:1}}>
                <Typography variant="h6" sx={{ color: "#101010", fontSize: 16 }}>
                  {t("footer.SupportHub")}
                </Typography>
                <Typography sx={{ fontSize: "15px", color: "black" }} variant="body2">
                  <Link href={"/help-center"}>
                    <a href={"/help-center"}>{t("footer.HelpCenter")}</a>
                  </Link>
                </Typography>
                <Typography sx={{ fontSize: "15px", color: "black" }} variant="body2">
                  <Link href={"#"}>
                    <a href={"#"} className="disabled-link">{t("footer.Find_product_to_sell")}</a>
                  </Link>
                </Typography>
                <Typography sx={{ fontSize: "15px", color: "black" }} variant="body2">
                  <Link href={"/seller-hub"}>
                    <a href={"/seller-hub"}>{t("footer.SellersHub")}</a>
                  </Link>
                </Typography>
              </Stack>
              <Stack spacing={1}  sx={{mb: isMobile?2:1}}>
                <Typography variant="h6" sx={{ color: "#101010", fontSize: 16 }}>
                  {t("footer.Policies")}
                </Typography>
                <Typography sx={{ fontSize: "15px", color: "black" }} variant="body2">
                  <Link href={"/buyer-protection"}>
                    <a href={"/buyer-protection"}>{t("footer.Buyer")}</a>
                  </Link>
                </Typography>
                <Typography sx={{ fontSize: "15px", color: "black" }} variant="body2">
                  <Link href={"/cancellation-refund"}>
                    <a href={"/cancellation-refund"}>{t("footer.Refund")}</a>
                  </Link>
                </Typography>
                <Typography sx={{ fontSize: "15px", color: "black" }} variant="body2">
                  <Link href={"/seller-agreement"}>
                    <a href={"/seller-agreement"}>{t("footer.Sellers_agreement")}</a>
                  </Link>
                </Typography>
                <LanguageSelect SelectProps={isMobile ? {
                  MenuProps: {
                    sx: { top: "-180px", maxHeight: "190px" },
                  },
                } : {
                  MenuProps: {
                    sx: { top: "-130px", maxHeight: "250px" },
                  },
                }} onChange={(e) => console.log(e)}></LanguageSelect>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Divider sx={{ mt: 2 }} />
      <Container component={"main"} maxWidth={false}>
        <Box
          sx={{
            fontSize: "16px", color: "black",
            display: "flex",
            mt: isMobileFooter ? 2 : 1,
            flexDirection: { xs: "column-reverse", sm: "column", md: "row" },
            justifyContent: "space-between",
          }}
        >
          <Typography variant="caption">
            Copyright &copy; 2023 Linconstore
          </Typography>

          <Box>
            <Typography variant="caption">{t("footer.All_Rights_Reserved")}</Typography>
            <Typography
              variant="caption"
              color={"blue"}
              sx={{ marginLeft: "4px" }}
            >
              | &nbsp;
              <Link href={"terms"}>
                <a
                  href={"terms"}
                  color="blue"
                  style={{ textDecoration: "underline" }}
                >
                  {t("footer.Terms")}
                </a>
              </Link>
            </Typography>
            <Typography
              variant="caption"
              color={"blue"}
              sx={{ marginLeft: "4px" }}
            >
              | &nbsp;
              <Link href={"privacy"}>
                <a
                  href={"privacy"}
                  color="blue"
                  style={{ textDecoration: "underline" }}
                >
                  {t("footer.Privacy")}
                </a>
              </Link>
            </Typography>
            <Typography
              variant="caption"
              color={"blue"}
              sx={{ marginLeft: "4px" }}
            >
              | &nbsp;
              <Link href={"cookie"}>
                <a
                  href={"cookie"}
                  color="blue"
                  style={{ textDecoration: "underline" }}
                >
                  {t("footer.Cookie")}
                </a>
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Paper>
  );
};
export default Footer;
