import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import slug from "slug";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

interface IsellerCard {
  image: string;
  name: string;
  _id: string;
}
const SellersCard: React.JSXElementConstructor<IsellerCard> = ({
  name,
  image,
  _id,
}) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <BrandCard
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#07a759",
        padding: "10px 20px",
        borderRadius: "10px",
        justifyContent: "space-between",
      }}
      onClick={() => router.push(`/store/${name}`)}
    >
      <Box>
        <Typography
          gutterBottom
          component="div"
          sx={{ fontSize: "15px", margin: 0, color: "#fff" }}
        >
          {name}
        </Typography>
        <Button
          onClick={() => router.push(`/store/${name}`)}
          sx={{ fontSize: "0.7rem", margin: 0, color: "#fff" }}
        >
          <Typography
            sx={{
              fontSize: "0.7rem",
              margin: 0,
              color: "#fff",
              textTransform: "none",
            }}
          >
            {t("seller.card.shop_now")}
          </Typography>{" "}
          <ArrowForwardIcon sx={{ width: 15 }} />
        </Button>
      </Box>
      <Image
        className={"products_image"}
        height={120}
        width={150}
        placeholder={"blur"}
        blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
        src={image}
        alt={"picture of product"}
      />
    </BrandCard>
  );
};
export default SellersCard;

// <Card
//       onClick={() => router.push(`/store/${name}`)}
//       className={"product_card"}
//       sx={{
//         minWidth: { xs: 50, sm: 250, lg: 300 },
//         mt: 3,
//       }}
//     >
//       {/* <CardMedia
//         component="img"
//         alt="store image"
//         height="200"
//         className={"product_image"}
//         image={image}
//       /> */}
//       <CardContent>
//         <Typography gutterBottom variant="h5" component="div">
//           {name}
//         </Typography>
//         {/*<Rating name="product_rating" value={3} readOnly />*/}
//       </CardContent>

//     </Card>

const BrandCard = styled(Box)({
  ":hover": {
    cursor: "pointer",
  },
});
