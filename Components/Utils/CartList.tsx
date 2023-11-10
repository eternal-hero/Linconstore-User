import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import {
  ListItemAvatar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";
type TVariant = {
  option: string;
  variant: string;
};
interface ICartList {
  image: string;
  title: React.ReactNode;
  amount: number;
  variants: TVariant[];
}
const CartList: React.FC<ICartList> = ({ image, amount, title, variants }) => {
  const isMobile = useMediaQuery("(max-width: 350px)");
  return (
    <List
      sx={{
        width: "100%",
        height: isMobile ? 100 : 70,
        bgcolor: "background.paper",
      }}
    >
      <ListItem>
        <ListItemAvatar>
          <Avatar
            variant={"square"}
            src={image}
            sx={{ width: 37, height: 34 }}
          />
        </ListItemAvatar>
        <ListItemText
          id=""
          primary={title}
          secondary={`${
            variants.length > 0
              ? variants[0].variant + `-` + variants[0].option
              : ""
          } `}
        />
        <Typography sx={{ ml: 1 }} variant={isMobile ? "body1" : "h6"}>
          ${Number(amount.toFixed(2))}
        </Typography>
      </ListItem>
    </List>
  );
};
export default CartList;
