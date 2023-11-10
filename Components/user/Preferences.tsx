import React, { useState } from "react";
import Box from "@mui/material/Box";
import {
  Card,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import GenNav from "../Layouts/GenNav";
import Nav from "../Layouts/Nav";
import Footer from "../Layouts/Footer";
import { useTranslation } from "react-i18next";
import LanguageSelect from "../LanguageSelect";
import { ExchangeCurrency } from "../../Helpers/Exchange";
import { useModifyUser } from "../../hooks/useDataFetch";
import Cookies from "js-cookie";

const Preferences: React.FC = () => {
  const userString = Cookies.get("userInfo");

  const [userInfo, setUserInfo] = useState(userString ? JSON.parse(userString) : null);

  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const { t } = useTranslation();

  const onUserSuccess = (data: object) => {
    const updateInfo = { ...userInfo, ...data }
    setUserInfo(updateInfo)
    Cookies.set("userInfo", JSON.stringify(updateInfo), { expires: 3, secure: true });
    alert("Updated successfully")
  };

  const { isLoading: isUserLoading, mutate: updateUser } = useModifyUser(onUserSuccess);

  const handleChangeLanguage = (language) => {
    const newData = { language: language };
    updateUser(newData);
  };

  const handleChangeCurrency = (e: any) => {
    const newData = { currency: e.target.value };
    updateUser(newData);
  };


  return (
    <>
      {isMobile ? <GenNav admin={false} mode={false} /> : <Nav />}
      <Card elevation={0} sx={{ borderRadius: "0px", minHeight: "calc(100vh - 315px)" }}>
        <Wrapper
          title={t("pagetitle.App_preference")}
          description={"manage your preference "}
          content={"Manage your Preference"}
        >
          <Box sx={{ display: "flex", flexDirection: "column", }}>
            <Box component={"article"} sx={{ mx: { md: 3 } }}>
              <Stack direction={"row"} gap={2} alignItems='center' mb={5}>
                <ArrowBack onClick={() => router.back()} className={"pointer"} sx={{ color: "#0ba659" }} />
                <Typography variant={"body1"} fontSize={15}>
                  {t("account.preference.title")}
                </Typography>
              </Stack>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  p: { md: 2, xs: 1 },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                    alignItems: "center",
                    p: { md: 2, xs: 1 },
                    mb: 2,
                  }}
                >
                  <Typography sx={{ fontSize: 14 }}>{t("account.preference.Language")}</Typography>
                  <Box>
                    <LanguageSelect SelectProps={isMobile ?
                      { MenuProps: { sx: { top: "-180px", maxHeight: "190px" } } }
                      :
                      { MenuProps: { sx: { top: "-130px", maxHeight: "250px" } } }
                    }
                      language={userInfo?.language} onChange={handleChangeLanguage}></LanguageSelect>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                    alignItems: "center",
                    p: { md: 2, xs: 1 },
                  }}
                >
                  <Typography sx={{ fontSize: 14 }}>{t("account.preference.Currency")}</Typography>
                  <TextField
                    select
                    size="small"
                    sx={{
                      backgroundColor: "#fff",
                      borderRadius: 3,
                      width: "fit-content",
                    }}
                    onChange={handleChangeCurrency}
                    value={userInfo?.currency}
                  >
                    {
                      ExchangeCurrency.map((currency, index) => (
                        <MenuItem key={index} value={currency.label}>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <ListItemIcon sx={{ maxHeight: "20px" }}>
                              {currency.symbol}
                            </ListItemIcon>
                            <ListItemText sx={{ ml: 1 }}>
                              <b>{currency.value}</b>
                            </ListItemText>
                          </div>
                        </MenuItem>
                      ))
                    }
                  </TextField>
                </Box>
              </Box>
            </Box >
          </Box>
        </Wrapper>
      </Card>
      <Footer />
    </>
  );
};
export default Preferences;
