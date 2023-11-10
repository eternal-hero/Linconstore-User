import React, { useContext, useEffect, useState } from "react";
import { Card, Rating, Stack, Typography, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import { ContentCopy } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { snackBarOpen } from "../../Store/Utils";
import Button from "@mui/material/Button";
import { addRatingModalOpen } from "../../Store/Modal";
import { IOrders, TProducts } from "../../Helpers/Types";
import { useRouter } from "next/router";
import Truncate from "../../Helpers/Truncate";
import ContextApi from "../../Store/context/ContextApi";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Image from "next/image";
import { setSelectedOrder } from "../../Store/Order";
import { useTranslation } from "react-i18next";

interface IUserOrder {
  order: IOrders;
  user: string;
  value: string;
}

const UserOrders: React.FC<IUserOrder> = ({ order, user, value }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleRating = useContext(ContextApi).handleRatingId;

  const handleRate = () => {
    handleRating(order.productId._id);
    dispatch(addRatingModalOpen());
  };

  const handleClick = async (data: string) => {
    await navigator.clipboard.writeText(data);
    dispatch(
      snackBarOpen({
        message: "Copied to clipboard",
        severity: "success",
        snackbarOpen: true,
        rate: 0,
        sellerRate: 0,
      })
    );
  };
  const router = useRouter();
  const handleRedirect = (id: string) => {
    router.push(`refund?q=${id}`);
  };
  const [isRated, setIsRated] = useState<boolean>(false);

  useEffect(() => {
    const isRated: boolean = order.productId.ratingId?.ratings?.some(
      (x) => x.userId === user
    );
    setIsRated(isRated);
  }, []);

  const handleOrderClick = () => {
    const orderData = JSON.stringify(order);
    localStorage.setItem('orderData', orderData);
    localStorage.setItem('userData', user);
    localStorage.setItem('rateOrderIndex', value);
    dispatch(setSelectedOrder({ order, user }));
    router.push("/account/orderDetail");
  };
  return (
    <Box
      sx={{
        my: 2,
        border: "1px solid #c3c3c3",
        borderRadius: "10px",
        bgcolor: "transparent",
      }}
      className={"pointer"}
      onClick={handleOrderClick}
    >
      <Box sx={{ display: "flex", p: 2, gap: 1 }}>
        <Image
          width={100}
          height={100}
          objectFit="cover"
          placeholder="blur"
          blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
          src={order.productId.photo[0]}
          alt={"image of product"}
        />
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          width={"100%"}
          mt={"auto"}
          mb={"auto"}
          alignItems={"center"}
        >
          <Box display={"flex"} flexDirection={"column"}>
            <Typography
              fontWeight={700}
              mb={1}
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "150px",
              }}
            >
              {order.productId.title}
            </Typography>
            <Typography
              color={
                order.status === "placed"
                  ? "#ffc109"
                  : order.status === "processed"
                    ? "#0ba659"
                    : order.status === "cancelled"
                      ? "brown"
                      : "gray"
              }
            >
              {t(`order.${order.status}`)}
            </Typography>
          </Box>
          <Box>
            <NavigateNextIcon />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserOrders;
