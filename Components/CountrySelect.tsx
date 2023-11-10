import React from "react";
import { useTranslation } from "react-i18next";
import { MenuItem, Select} from "@mui/material";

interface CountrySelectProps {
  field: any;
  countryList: any;
  onChange: any;
}

const LanguageSelect: React.JSXElementConstructor<any> = ({ field, countryList, onChange }: CountrySelectProps) => {
  const { t } = useTranslation();

  return (
    <Select
      labelId="demo-simple-select-standard-label"
      id="demo-simple-select-standard"
      {...field}
      className="outlined"
      variant="standard"
      label="Select country"
      sx={{
        bgcolor: "#fff",
        height: "30px",
        width: "100%",
        my: 1,
        marginTop: "-8px",
        color: "#000",
        border: "none !important",
      }}      
      onChange={(e) => {
        field.onChange(e); // This triggers the change event
        onChange(e)
      }}
      MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
    >
      <MenuItem value="none" disabled style={{ display: "none" }}>
        {t("register.select_country")}
      </MenuItem>
      {countryList.map((country, index) => (
        <MenuItem key={index} value={country.shortCode}>
          {country.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default LanguageSelect;
