import { Card, Grid, Typography } from "@mui/material";
import React from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import { useRouter } from "next/router";
import slug from "slug";
interface ICatCard {
  link: string;
  category: string;
  id: string;
}
const Catcard: React.JSXElementConstructor<ICatCard> = ({
  category,
  link,
  id,
}) => {
  const router = useRouter();
  return (
    <Card
      onClick={() =>
        router.push("/category/[slug]", `/category/${slug(category)}-${id}`)
      }
      className={"category"}
      variant={"outlined"}
      sx={{ border: "none", minWidth: "130px" }}
    >
      <Box sx={{ display: "row", flexDirection: "row", p: 2 }}>
        <Image
          className={"category_image"}
          height={100}
          width={100}
          priority={true}
          placeholder={"blur"}
          blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
          src={link}
          alt={"image of category"}
        />
        <Grid container direction={"column"} spacing={2}>
          <Grid item xs={4} />
          <Grid item xs={4}>
            <Typography textAlign={"center"} variant={"body1"} fontSize={14}>
              {category}
            </Typography>
          </Grid>
          <Grid item xs={4} />
        </Grid>
      </Box>
    </Card>
  );
};
export default Catcard;
