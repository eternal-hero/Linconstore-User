import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { InputAdornment } from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";
import React from "react";
import { useTranslation } from "react-i18next";

interface Isearch {
  search: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const Search: React.FC<Isearch> = ({ search, handleChange }) => {
  const { t } = useTranslation();

  return (
    <Box component={"form"} width={"100%"}>
      <TextField
        variant={"outlined"}
        type={"text"}
        fullWidth
        name={"Search"}
        required
        value={search}
        sx={{
          my: 2,
          borderRadius: 2,
          border: "2px solid #000",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#000",
              borderWidth: 4,
              border: "none !important",
              outline: "none !important",
            },
            "&:hover fieldset": {
              borderColor: "#000",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#000",
              borderWidth: 4,
            },
          },
        }}
        InputProps={{
          style: { color: "#000", borderRadius: "12px" },
          endAdornment: (
            <InputAdornment position="end">
              <SearchOutlined className={"pointer"} />
            </InputAdornment>
          ),
        }}
        placeholder={t("search.search_placeholder")}
        onChange={handleChange}
        autoComplete={"Search"}
      />
    </Box>
  );
};
export default Search;
