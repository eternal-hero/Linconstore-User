import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Typography,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import {
  AddCircleOutlined,
  Delete,
  FavoriteBorderOutlined,
  RemoveCircleOutlined
} from "@mui/icons-material";
import {
  useAddUserWishlist,
  useDecrementCart,
  useDeleteCart,
  useIncrementCart,
} from "../../hooks/useDataFetch";
import { useDispatch } from "react-redux";
import { snackBarOpen } from "../../Store/Utils";
import ContextApi from "../../Store/context/ContextApi";
import { IProducts } from "../../Helpers/Types";
import { groupByKey } from "../Product/Index";
import Image from "next/image";
import { useCurrency } from "../../hooks/useCurrency";
type TVariant = {
  option: string;
  variant: string;
};
type IVariant = {
  option: string;
  stock: number;
  price: number;
};
type IMain = {
  variant: string;
  options: IVariant[];
};
type TProductCart = {
  productId: IProducts;
  name: string;
  quantity: number;
  price: number;
  variants: TVariant[];
  photo: string;
};
interface IProductCart {
  cart: TProductCart;
  handleRefetch: () => void;
  deleteHandler: (id: string) => void;
  countryRate: any;
  currencySymbol: any;
}
const CartCards: React.FC<IProductCart> = ({
  cart,
  handleRefetch,
  deleteHandler,
  countryRate,
  currencySymbol,
}) => {
  const {
    quantity: initialQuantity,
    price: initialPrice,
    name,
    photo,
    productId,
    variants,
  } = cart;
  localStorage.setItem("tttttt", JSON.stringify(cart));
  const [value, setValue] = useState<number>(initialQuantity);
  const [price, setPrice] = useState<number>(initialPrice);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const handleCartChange = useContext(ContextApi).handleCartChange;
  const handleUpdateCart = useContext(ContextApi).handleUpdateCart;
  const currency = useCurrency();
  
  const onIncrementSuccess = () => {
    handleUpdateCart();
  };
  const onDecrementSuccess = () => {
    handleUpdateCart();
  };
  const { mutate: incrementCart } = useIncrementCart(onIncrementSuccess);
  const { mutate: decrementCart } = useDecrementCart(onDecrementSuccess);
  const [variantLimit, setVariantLimit] = useState<number>(productId.quantity);
  const increment = useCallback(() => {
    if (value === variantLimit) return;
    const data = {
      productId: productId._id,
    };
    incrementCart(data);
    setValue((cur) => cur + 1);
  }, [value, variantLimit]);
  const decrement = useCallback(() => {
    if (value === 1) {
      return;
    }
    const data = {
      productId: productId._id,
    };
    decrementCart(data);
    setValue((cur) => cur - 1);
  }, [value]);
  const handleDelete = (id: string) => {
    deleteHandler(id);
    deleteCart(id);
  };
  const handleFavourite = (id: string) => {
    const data = { productId: id, variants, price };
    addToFav(data);
    deleteHandler(id);
    // handleDelete(id)
  };
  const dispatch = useDispatch();
  const onDeleteSuccess = () => {
    handleCartChange();
    dispatch(
      snackBarOpen({
        message: "success",
        snackbarOpen: true,
        severity: "success",
        rate: 0,
        sellerRate: 0,
      })
    );
    setTimeout(() => {
      handleRefetch();
    }, 2000);
  };
  useEffect(() => {
    if (isError || isDeleteError) {
      dispatch(
        snackBarOpen({
          message: "something went wrong",
          severity: "error",
          snackbarOpen: true,
          rate: 0,
          sellerRate: 0,
        })
      );
    }
  }, []);

  const {
    mutate: deleteCart,
    isLoading: isDeleting,
    isError: isDeleteError,
  } = useDeleteCart(onDeleteSuccess);
  const {
    mutate: addToFav,
    isLoading,
    isError,
  } = useAddUserWishlist(onDeleteSuccess);
  const [variant, setVariants] = useState<IMain[]>([]);

  useEffect(() => {
    if (!cart) return;
    const groupedVariant = groupByKey(productId.variants, "variant", {
      omitKey: true,
    });
    if (!groupedVariant) return;
    const variantPlaceholder: IMain[] = [];
    Object.entries(groupedVariant).map((x) => {
      const data = {
        variant: x[0] as string,
        options: x[1] as IVariant[],
      };
      variantPlaceholder.push(data);
    });
    setVariants(variantPlaceholder);
  }, []);
  useEffect(() => {
    if (variants.length === 0) return;
    let option1 = variants[0].option;
    let option2 = variants.length > 1 ? variants[1].option : "";
    let stock = 1000000;
    variant.map((x) => {
      x.options.map((y) => {
        if (y.option === option1) {
          if (y.stock < stock) {
            stock = y.stock;
          }
        }
        if (variants.length > 1) {
          if (y.option === option2) {
            if (y.stock < stock) {
              stock = y.stock;
            }
          }
        }
      });
    });
    setVariantLimit(stock);
  }, [value, variant]);
  return (
    <Box sx={{ my: 1, width: "100%" }}>
      <Box>
        <Box
          sx={{
            my: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              p: 2,
              gap: 2,
              border: "1px solid #c3c3c3",
              borderRadius: "10px",
            }}
          >
            <Image
              width={100}
              height={100}
              objectFit="cover"
              placeholder="blur"
              blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
              src={photo}
              alt={"image of product"}
            />
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              width={"100%"}
              mt={"auto"}
              mb={"auto"}
              alignItems={"center"}
              position={"relative"}
            >
              <Box display={"flex"} flexDirection={"column"}>
                <Typography
                  sx={{
                    mb: 1,
                    position: "absolute",
                    top: 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: isMobile ? "100px" : "200px",
                    fontSize: "14px",
                  }}
                >
                  {name}
                </Typography>
                {variants.map((variant) => (
                  <Box
                    key={variant.option}
                    display={"flex"}
                    flexDirection={"row"}
                  >
                    <Typography fontSize={!isMobile ? "16px" : "14px"}>
                      {variant.variant}:
                    </Typography>
                    <Typography fontSize={!isMobile ? "16px" : "14px"}>
                      {variant.option}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Box
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"space-between"}
                alignItems={"flex-end"}
                gap={2}
              >
                <Typography sx={{ color: "#0ba659" }}>
                  {currencySymbol}&nbsp;&nbsp;
                  {((price * currency(productId.owner.currency)) / countryRate).toFixed(2)}{" "}
                </Typography>
                <Box display={"flex"} justifyContent={"space-between"}>
                  <RemoveCircleOutlined
                    onClick={decrement}
                    className={"pointer"}
                    sx={{ color: "#0ba659" }}
                  />
                  <Typography mx={3}>{value}</Typography>
                  <AddCircleOutlined
                    onClick={increment}
                    className={"pointer"}
                    sx={{ color: "#0ba659" }}
                  />
                </Box>
                <Box display={"flex"} justifyContent={"space-between"}>
                  <Delete
                    sx={{ mr: 7, color: "#0ba659" }}
                    onClick={() => handleDelete(productId._id)}
                    className={"pointer"}
                  />
                  <FavoriteBorderOutlined
                    onClick={() => handleFavourite(productId._id)}
                    className={"pointer"}
                    sx={{ color: "#0ba659" }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default CartCards;
