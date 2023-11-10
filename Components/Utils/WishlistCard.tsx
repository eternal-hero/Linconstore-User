import React, { useEffect, useContext, useState } from "react";
import {
  Grid,
  Rating,
  Typography,
  useMediaQuery,
} from "@mui/material";

import StarIcon from "@mui/icons-material/Star";
import Box from "@mui/material/Box";
import Image from "next/image";
import { useRouter } from "next/router";
import { TProducts } from "../../Helpers/Types";
import { modalUserOpen } from "../../Store/Modal";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useAddToCart,
  useDeleteSingleWish,
  useDeleteWish,
} from "../../hooks/useDataFetch";
import ContextApi from "../../Store/context/ContextApi";
import { useDispatch } from "react-redux";
import Truncate from "../../Helpers/Truncate";
import { useCurrency } from "../../hooks/useCurrency";
import { formatNumber } from "../../Helpers/utils";
import { useTranslation } from "react-i18next";

type Tvariants = {
  option: string;
  variant: string;
};
type Product = {
  productId: TProducts;
  price: number;
  created_at: Date;
  variants: Tvariants[];
  _id: string;
  check: boolean;
};
interface IWish {
  wishlists: Product[];
  handleRefetch: () => void;
  countryRate: any;
  currencySymbol: any;
}
const WishlistCard: React.FC<IWish> = ({
  wishlists,
  handleRefetch,
  countryRate,
  currencySymbol,
}) => {
  const [initialData, setInitialData] = useState<Product[]>(
    wishlists.sort((a: Product, b: Product) =>
      a.productId.title.localeCompare(b.productId.title)
    )
  );

  const { t } = useTranslation();
  useEffect(() => {
    setInitialData(wishlists.sort((a: Product, b: Product) => a.productId.title.localeCompare(b.productId.title)))
  }, [wishlists]);

  const router = useRouter();
  const currency = useCurrency();
  const [check, setCheck] = useState(false);
  const isChecked: boolean = initialData.some((data) => data.check);
  const dispatch = useDispatch();
  const isMatches: boolean = useMediaQuery("(max-width: 620px)");
  const isMobile: boolean = useMediaQuery("(max-width: 420px)");
  const allChecked: boolean = initialData.every((data) => data.check);
  const handleChange = (title: string) => {
    const data: Product | undefined = initialData.find(
      (row) => row.productId.title === title
    );
    data!.check = !data!.check;
    const filteredData: Product[] = initialData.filter(
      (row) => row.productId.title !== title
    );
    filteredData.push(data!);
    const sorted = filteredData.sort((a: Product, b: Product) =>
      a.productId.title.localeCompare(b.productId.title)
    );
    setInitialData(sorted);
  };
  const isLoggedIn = useContext(ContextApi).isLoggedIn;
  const handleCheckAll = () => {
    setCheck((cur) => !cur);
    const newData: any = [];
    if (allChecked) {
      initialData.forEach((data) => {
        data.check = false;
        newData.push(data);
      });
    } else {
      initialData.forEach((data) => {
        data.check = true;
        newData.push(data);
      });
    }
  };
  const removeFromWishlist = () => {
    const newData: Product[] = initialData;
    const deleteArrays: string[] = [];
    const deleteWish: Product[] = newData.filter((row) => row.check);
    deleteWish.forEach((wish) => {
      deleteArrays.push(wish._id);
    });
    deleteWishlist(deleteArrays);
  };
  const handleSingleDelete = (id: string) => {
    DeleteSingleWish(id);
    handleRefetch();
  };

  const handleAddToCart = (
    id: string,
    _id: string,
    price: number,
    variants: Tvariants[]
  ) => {
    if (!isLoggedIn) return router.push("/login");
    const data = {
      productId: id,
      quantity: 1,
      price,
      variants,
    };
    addToCart(data);
    handleSingleDelete(_id);
  };
  const onSuccess = () => {
    // @ts-ignore
    dispatch(
      modalUserOpen({
        message: "Item was successfully added to cart",
        image: "/assets/img/Shopping-bag.svg",
        modalType: "cart",
      })
    );
    handleRefetch();
  };
  const onDeleteSuccess = (data: any) => {
    handleRefetch();
  };

  const { isLoading: isDeleting, mutate: deleteWishlist } = useDeleteWish(onDeleteSuccess);
  const { isLoading, mutate: addToCart } = useAddToCart(onSuccess);
  const { mutate: DeleteSingleWish, isLoading: isDeletingSingle } = useDeleteSingleWish(onDeleteSuccess);
  return (
    <>
      {/*<Card className={'wishCard'} sx={{my:1}}>*/}
      {/*    /!* design a cart card *!/*/}
      {/*    <Box sx={{display: 'flex'}}>*/}
      {/*        <Image  src={'https://cdn.pixabay.com/photo/2017/02/12/17/17/music-2060616_960_720.jpg'} width={'200px'} height={'150px'}*/}
      {/*                placeholder={'blur'}*/}
      {/*                blurDataURL={'https://cdn.pixabay.com/photo/2017/02/12/17/17/music-2060616_960_720.jpg'} />*/}
      {/*        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>*/}
      {/*            <Stack direction={'row'} spacing={3} sx={{p:1,   display: 'flex',  justifyContent:'space-between'}}>*/}
      {/*                <Stack >*/}
      {/*                    <Typography  variant={'h6'}>Item Name</Typography>*/}
      {/*                    <Typography gutterBottom variant={'body2'}>L</Typography>*/}
      {/*                </Stack>*/}
      {/*                <span style={{marginTop:4}} onClick={() => router.push('/cart')} className={'wish_to_cart'}>*/}
      {/*                        <ShoppingCartOutlined   />*/}
      {/*                        </span>*/}
      {/*            </Stack>*/}

      {/*                <Typography sx={{px:1}} variant={'body2'}>$5</Typography>*/}
      {/*        </Box>*/}
      {/*    </Box>*/}
      {/*</Card>*/}

      {/* <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {wishlists.map(({ productId, _id, price, variants }, index) => {
          if (productId?._id) {
            return (
              <Card
                key={index}
                sx={{
                  display: { xs: "flex", sm: "none" },
                  my: 1,
                  border: "0px !important",
                  bgcolor: "transparent",
                  width: "100%",
                }}
              >
                <Stack spacing={2} direction={"row"} width={"100%"}>
                  <img
                    src={productId?.photo[0]}
                    width={"100%"}
                    height={"120px"}
                    placeholder={"blur"}
                    className={isMatches ? "wishlist_mobile" : "userOrders"}
                    alt={"wishMobile Image"}
                  />
                  <Stack spacing={2} sx={{ p: 1, mb: 1 }} flex={0.8}>
                    <Stack spacing={0}>
                      <Typography variant={"body1"}>
                        <b>{Truncate(productId.title, 30)}</b>
                      </Typography>
                      <Typography variant={"body1"}>
                        <b> $ {productId.price} </b>
                      </Typography>

                      <Typography variant={"subtitle2"}> in stock </Typography>
                    </Stack>
                    <Stack
                      direction={"row"}
                      spacing={2}
                      justifyContent={"space-between"}
                    >
                      {isDeletingSingle && (
                        <Typography variant={"caption"}>deleting...</Typography>
                      )}
                      <DeleteOutline
                        onClick={() => handleSingleDelete(_id)}
                        className={"pointer"}
                      />
                      <Button
                        variant={"outlined"}
                        disabled={isLoading}
                        size={"small"}
                        sx={{ fontSize: isMobile ? 8 : 10, mt: 2 }}
                        color={"success"}
                        onClick={() =>
                          handleAddToCart(productId._id, _id, price, variants)
                        }
                      >
                        {isLoading && <CircularProgress />} Add to Cart
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              </Card>
            );
          }
        })}
      </Box> */}
      {/* <Stack
        direction={"row"}
        spacing={2}
        sx={{ display: { xs: "none", sm: "flex" } }}
      >
        <Button
          disabled={!isChecked}
          endIcon={<ShoppingCartOutlined />}
          variant={"contained"}
        >
          Add to Cart
        </Button>
        <Button
          disabled={!isChecked}
          color={"error"}
          variant={"contained"}
          onClick={() => removeFromWishlist()}
        >
          Remove {isDeleting && <CircularProgress />}{" "}
        </Button>
      </Stack> */}
      {/* <TableContainer sx={{ display: { xs: "none", sm: "flex" } }}>
        <Table
          size={"small"}
          sx={{ minWidth: 650, maxWidth: "100%" }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                   <Checkbox
                   color="primary"
                />
                <Checkbox
                  color="primary"
                  checked={allChecked}
                  onChange={handleCheckAll}
                />
              </TableCell>
              <TableCell> </TableCell>
              <TableCell> Product Name</TableCell>
              <TableCell> Unit </TableCell>
              <TableCell> Stock Status</TableCell>
              <TableCell> </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {initialData.map(
              (
                { productId, variants, price, check, created_at, _id },
                index
              ) => {
                if (productId?._id) {
                  return (
                    <TableRow
                      key={index + _id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={check}
                          onChange={() => handleChange(productId.title)}
                        />
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Image
                          width={100}
                          height={60}
                          style={{
                            marginTop: 30,
                            width: "100%",
                            height: "100%",
                          }}
                          placeholder="blur"
                          blurDataURL={
                            "https://via.placeholder.com/300.png/09f/fff"
                          }
                          src={productId.photo[0]}
                          alt={"image of tableCell"}
                        />
                      </TableCell>
                      <TableCell>{productId.title}</TableCell>
                      <TableCell>{productId.price}</TableCell>
                      <TableCell>In Stock</TableCell>
                      <TableCell align={"right"}>
                        <Stack>
                          <Typography variant={'body1'}>Added on  { created_at.toLocaleDateString()} </Typography>
                          <Button
                            sx={{ borderRadius: 25 }}
                            size={"small"}
                            variant={"contained"}
                            color={"success"}
                            disabled={isLoading}
                            onClick={() =>
                              handleAddToCart(
                                productId._id,
                                _id,
                                price,
                                variants
                              )
                            }
                          >
                            Add to cart {isLoading && <CircularProgress />}
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                }
              }
            )}
          </TableBody>
        </Table>
      </TableContainer> */}
      <Grid container spacing={2}>
        {initialData.map((product) => {
          const sellerRate = currency(product.productId.owner.currency);
          return (
            <Grid key={product._id} item md={3} sm={4} xs={6}>
              <Box borderRadius={10}>
                <Box
                  position="relative"
                  borderRadius={"20px"}
                  overflow={"hidden"}
                >
                  <Image
                    layout="responsive"
                    width={500}
                    height={500}
                    objectFit="cover"
                    placeholder="blur"
                    blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
                    src={product.productId.photo[0]}
                    alt={"image of product"}
                  />
                  <Box
                    position="absolute"
                    top={10}
                    left={5}
                    bgcolor={"white"}
                    borderRadius={"50%"}
                    display={"flex"}
                    alignItems={"center"}
                    p={1}
                  >
                    <ShoppingBagIcon
                      sx={{ color: "#0ba659", cursor: "pointer" }}
                      onClick={() =>
                        handleAddToCart(
                          product.productId._id,
                          product._id,
                          product.price,
                          product.variants
                        )
                      }
                    />
                  </Box>
                  <Box
                    position="absolute"
                    top={10}
                    right={5}
                    bgcolor={"white"}
                    borderRadius={"50%"}
                    display={"flex"}
                    alignItems={"center"}
                    p={1}
                  >
                    <DeleteIcon
                      sx={{ color: "#0ba659", cursor: "pointer" }}
                      onClick={() => deleteWishlist([product._id])}
                    />
                  </Box>
                </Box>
                <Box display="flex" flexDirection="column">
                  <Typography
                    sx={{
                      width: "150px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {product.productId.title}
                  </Typography>
                  <Typography>
                    Ships from {product.productId.owner?.owner?.location.toLowerCase()}
                  </Typography>
                  {product.productId.ratingId && (
                    <>
                      <Box display="flex" alignItems="center">
                        <StarIcon fontSize={"small"} sx={{ color: "#FFD700" }} />{" "}
                        <Typography>
                          {formatNumber(product.productId.ratingId?.averageRating)} ({product.productId.ratingId?.ratings?.length}{" "}
                          {product.productId.ratingId?.ratings?.length > 1
                            ? t("product.reviews")
                            : t("product.review")}
                          )
                        </Typography>
                      </Box>
                    </>
                  )}
                  <Typography sx={{ color: "#0ba659" }}>
                    {currencySymbol}&nbsp;&nbsp;
                    {((product.price * sellerRate) / countryRate).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
export default WishlistCard;
