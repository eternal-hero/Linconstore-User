import React from "react";
import Head from "next/head";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { NextSeo } from "next-seo";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { Padding } from "@mui/icons-material";

interface Holder {
  children: React.ReactNode;
  title: string;
  description: string;
  image: string;
  content: string;
}
const ProductWrapper: React.JSXElementConstructor<Holder> = ({
  children,
  image,
  title,
  description,
  content,
}) => {
  const theme = useTheme();
  const isMobile: boolean = useMediaQuery("(max-width: 600px)");
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name={description} content={content} />
        <link rel="icon" href="/favicon-store.ico" />
      </Head>
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          title: `${title}`,
          description: `${description}`,
          images: [
            {
              url: `${image}`,
              width: 800,
              height: 420,
              alt: `${title}`,
            },
          ],
        }}
      />
      <Container
        component="main"
        maxWidth={"xl"}
        disableGutters={useMediaQuery(theme.breakpoints.only("xs"))}
        sx={{mt: 2}}
      >
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",

            // alignItems: 'center',
            // height: 600,
            justifyContent: "center",
          }}
        >
          {children}
        </Box>
      </Container>
    </>
  );
};

export default ProductWrapper;
