import React from "react";
import TextField from "@mui/material/TextField";
import { useTranslation } from "react-i18next";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Flag from "react-world-flags";
import ListItemText from "@mui/material/ListItemText";
import { languages } from "../config/i18n";
import { getLangPlusCountryCode } from "../Helpers/utils";
import { useRouter } from 'next/router';

interface LanguageSelectProps {
  SelectProps?: any;
  onChange?: any;
  language?: any;
}

const LanguageSelect: React.JSXElementConstructor<any> = ({ SelectProps, onChange, language }: LanguageSelectProps) => {
  const { i18n, t } = useTranslation();
  const router = useRouter();
  const { pathname, asPath, query } = router;

  const handleChangeLang = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const language = e.target.value;
    i18n.changeLanguage(language);
    localStorage.setItem("currentLanguage", language);
    onChange(language)
    router.push({ pathname, query }, asPath, { locale: language })
  };

  return (
    <TextField
      select
      defaultValue={i18n.language}
      key={i18n.language}
      onChange={(e) => handleChangeLang(e)}
      sx={{
        backgroundColor: "#fff",
        borderRadius: 1,
        width: "fit-content",
      }}
      variant="standard"
      SelectProps={SelectProps}
      value={language}
    >
      {languages.map((language) => {
        const { code, country } = language;
        const langPlusCountryCode = getLangPlusCountryCode(language);
        return (
          <MenuItem key={langPlusCountryCode} value={langPlusCountryCode}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <ListItemIcon sx={{ maxHeight: "20px" }}>
                <Flag code={country ?? code}></Flag>
              </ListItemIcon>
              <ListItemText sx={{ ml: 1, '& span': { fontSize: 14 } }}>
                <b>{t(`language.${langPlusCountryCode}`)}</b>
              </ListItemText>
            </div>
          </MenuItem>
        );
      })}
    </TextField>
  );
};

export default LanguageSelect;
