import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
} from "@mui/material";
import AddItemCards from "../Utils/AddItemCards";
import StoreHeader from "./StoreHeader";
import Product_reviews from "./Product_reviews";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Logo from "../Utils/Logo";
import Typography from "@mui/material/Typography";
import * as React from "react";
import getDate from "../../Helpers/getDate";

const PublishStore: React.JSXElementConstructor<any> = () => {
  const router = useRouter();
  return (
    <>
      <Box
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Logo />
      </Box>
      <StoreHeader
        logo={""}
        title={""}
        createdAt={getDate}
        summary={""}
        location={""}
      />
      <AddItemCards title={"Top deals"} />
      <AddItemCards title={"All items"} />
      {/*<Product_reviews empty={true} />*/}
      <Button
        onClick={() => router.push("/seller")}
        variant="contained"
        fullWidth
        type="submit"
        className={"buttonClass"}
        sx={{ mt: 3, mb: 2 }}
      >
        Personalize your store
      </Button>
    </>
  );
};
export default PublishStore;
