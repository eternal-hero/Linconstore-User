import React, { useEffect } from "react";
import LanguageSelect from "./LanguageSelect";
import { useTranslation } from "react-i18next";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { languages } from "../config/i18n";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { setLanguageModal, setModalCookie } from "../Store/Modal";
import { getLangPlusCountryCode } from "../Helpers/utils";

const LanguageModalComponet: React.FC = () => {
  // pages/index.js
  const LanguageModal = useSelector((state: any) => state.modal.languageModal);
  useEffect(() => {
    dispatch(setLanguageModal(true));

  }, []);

  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();

  const handleClose = () => {
    // setOpen(false);
    dispatch(setLanguageModal(false));
    // localStorage.setItem("currentLanguage", i18n.language);
    Cookies.set("currentLanguage", i18n.language, { expires: 7, secure: true });

    if (Cookies.get("CookiesBannerStatus") === "true") {
      dispatch(setModalCookie(false))
    } else {
      dispatch(setModalCookie(true));
    }
  };

  useEffect(() => {

    if (Cookies.get("currentLanguage")) {
      // setOpen(false);
      dispatch(setLanguageModal(false));
    } else {
      if (
        languages.some(
          (language) => getLangPlusCountryCode(language) === navigator.language
        )
      ) {
        i18n.changeLanguage(navigator.language);
      } else {
        const broswerLangCode = navigator.language.slice(0, 2);
        const language = languages.find(({ code }) => code === broswerLangCode);
        i18n.changeLanguage(
          language
            ? getLangPlusCountryCode(language)
            : getLangPlusCountryCode(languages[0])
        );
      }
    }
  }, []);

  return (
    <Dialog
      open={LanguageModal}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{ fontSize: 14 }}>
        {t("language.select_a_language")}
      </DialogTitle>
      <DialogContent>
        <LanguageSelect
          SelectProps={{ MenuProps: { sx: { maxHeight: "30%" } } }}
          onChange={(e) => console.log(e)}
        ></LanguageSelect>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          {t("button.ok")}
        </Button>
      </DialogActions>
    </Dialog>
  )
};

export default LanguageModalComponet;
