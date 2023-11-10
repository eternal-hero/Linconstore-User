import React from 'react';
import Head from "next/head";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { NextSeo } from 'next-seo';

interface Holder {
    children: React.ReactNode,
    title: string,
    description: string
    content: string,
}
const Wrapper : React.JSXElementConstructor<Holder> = ({children,title,description,content}) => {
    return (
      <>
        <Head>
          <title>{title}</title>
          <meta name={description} content={content} />
          <link rel="icon" href="/favicon-store.ico" />
        </Head>
        <NextSeo  title={title} description={description} />
        <Box>
          <CssBaseline />
          <Box
            sx={{
              // marginTop: 3,
              // marginBottom: 3,
              display: "flex",
              flexDirection: "column",
              // alignItems: 'center',
              // height: 600,
              justifyContent: "center",
            }}
          >
            {children}
          </Box>
        </Box>
      </>
    );
};

export default Wrapper;