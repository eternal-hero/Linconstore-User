import React from "react";
import Head from "next/head";
import CssBaseline from "@mui/material/CssBaseline";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Logo from "../Utils/Logo";

interface Holder {
  children: React.ReactNode;
}
const StoreHolder: React.JSXElementConstructor<Holder> = ({ children }) => {
  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 1,
          marginBottom: 3,
          display: "flex",
          flexDirection: "column",
          // alignItems: 'center',
          // height: 600,
          justifyContent: "center",
        }}
      >
        {children}
      </Box>
    </>
  );
};

export default StoreHolder;
