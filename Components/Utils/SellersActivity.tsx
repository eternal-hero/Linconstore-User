import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import {
  Divider,
  ListItemAvatar,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import getDate, { reCreateDate } from "../../Helpers/getDate";
import { useSelector } from "react-redux";

interface ISellerActivity {
  title: string;
  date: Date;
  image: string;
  type: string;
  amount: number;
}
interface TCurrency {
  currency: {
    currency: string;
  };
}
const SellersActivity: React.FC<ISellerActivity> = ({
  title,
  type,
  amount,
  date,
  image,
}) => {
  const currency: string = useSelector(
    (state: TCurrency) => state.currency.currency
  );
  const isMobile: boolean = useMediaQuery("(max-width: 600px)");
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      <ListItem>
        <ListItemAvatar>
          <Avatar
            variant={"circular"}
            src={type === "debit" ? "/assets/img/lincoinStore.jpg" : image}
            sx={{ width: 37, height: 34 }}
          />
        </ListItemAvatar>
        <ListItemText>
          <Typography
            variant={"body2"}
            sx={{
              color: type === "debit" ? "#000" : "#00a859",
              width: isMobile ? 130 : 200,
            }}
          >
            {title}
          </Typography>
        </ListItemText>
        <ListItemText>
          <Typography
            variant={"body2"}
            sx={{ color: type === "debit" ? "#000" : "#00a859" }}
          >
            {reCreateDate(date)}
          </Typography>
        </ListItemText>
        <Typography
          variant={"body2"}
          sx={{ color: type === "debit" ? "#000" : "#00a859" }}
        >
          {currency}
          {amount.toFixed(2)}
        </Typography>
      </ListItem>
    </List>
  );
};
export default SellersActivity;
