import React from "react";
import Head from "next/head";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import GenNav from "../Layouts/GenNav";
import { useMediaQuery } from "@mui/material";

interface Holder {
  children: any;
  title: string;
}
const Holder: React.JSXElementConstructor<any> = (props: Holder) => {
  const { title, children } = props;
  const isMobile = useMediaQuery('(max-width: 600px)');
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content={`Please Sign ${
            title === "Register" ? "Up" : "In"
          } to make a Complaint`}
        />
        <link rel="icon" href="/favicon-store.ico" />
      </Head>
      <GenNav admin={false} mode={false} />
      <Box component="main" bgcolor={"rgba(11, 166, 89, 0.08)"}>
        <CssBaseline />
        <Box
          sx={{
            // marginTop: isMobile && 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            // height: 600,
            // justifyContent: 'center'
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
};

export default Holder;
