import Box from "@mui/material/Box";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Grid from "@mui/material/Grid";
import "react-image-gallery/styles/css/image-gallery.css";
import { styled } from "@mui/material/styles";
import ImageGallery from "react-image-gallery";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import {
  Card,
  CircularProgress,
  FormControl,
  Paper,
  Stack,
  useMediaQuery,
  IconButton,
  Modal,
  FormControlLabel,
  RadioGroup,
  Radio,
  Container,
} from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import WarningIcon from '@mui/icons-material/Warning';
import ShareIcon from '@mui/icons-material/Share';
import Typography from "@mui/material/Typography";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  FavoriteBorder,
  InfoOutlined,
  SmsOutlined,
  InfoRounded,
  AddBoxOutlined,
  IndeterminateCheckBoxOutlined,
  VerifiedUser,
  Close,
  Grade
} from "@mui/icons-material";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Nav from "../Layouts/Nav";
import Product_reviews from "../Seller/Product_reviews";
import { useDispatch } from "react-redux";
import {
  modalUserOpen,
  openCloseBuyerProtectionModal,
} from "../../Store/Modal";
import { useRouter } from "next/router";
import SimpleAccordion from "../Utils/Accordion";
import {
  useAddToCart,
  useAddUserWishlist,
  useFollowSeller,
  useCreateReport,
} from "../../hooks/useDataFetch";
import ContextApi from "../../Store/context/ContextApi";
import { snackBarOpen } from "../../Store/Utils";
import { useTranslation } from "react-i18next";
import slug from "slug";
import ProductWrapper from "../Wappers/ProductWrapper";
import { getHighestNumber, getLowestStock } from "../../Helpers/utils";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Cookies from "js-cookie";
import { getUserCurrencySymbol } from "../../Helpers/Exchange";
import ProductCards from "../Utils/ProductCards";
import BuyerProtectionModal from "../Utils/Seller/BuyerProtectionModal";
import { useCurrency } from "../../hooks/useCurrency";
import LanguageModalComponet from "../LanguageModal";
import { countryCurrency } from "../../Helpers/Exchange";

let firstStock = false;
let secondStock = false;
let thirdStock = false;
type TSeller = {
  name: string;
  _id: string;
};
type IReviews = {
  rate: number;
  name: string;
  description: string;
};
interface IProducts {
  data: any;
  reviews: IReviews[];
}
type IVariants = {
  variant: string;
  option: string;
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
export const groupByKey = (list: any[], key: string, { omitKey = false }) =>
  list?.reduce(
    (hash, { [key]: value, ...rest }) => ({
      ...hash,
      [value]: (hash[value] || []).concat(
        omitKey ? { ...rest } : { [key]: value, ...rest }
      ),
    }),
    {}
  );

const Product: React.FC<IProducts> = ({ data, reviews }) => {
  const products = data.product
  const mProducts = data.mProducts
  const sProducts = data.sProducts
  const aProducts = data.aProducts
  const { t } = useTranslation();
  const {
    title,
    photo,
    variants: initialVariant,
    owner,
    quantity: quaty,
    instruction,
    shippingDetail,
    _id: id,
    description,
    condition,
    price: initialPrice,
  } = products;

  type reportReason = {
    reason: string;
  };
  const schema = yup.object().shape({
    reason: yup.string().required(),
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<reportReason>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      reason: "",
    },
  });

  const onSubmit: SubmitHandler<reportReason> = async (data) => {
    const newData = {
      productId: products._id,
      owner: owner._id,
      ...data,
    };
    createReport(newData);
  };

  const onCreateReportSuccess = () => {
    setOpenReportModal(false);
    dispatch(
      snackBarOpen({
        message: "Report is successfully created",
        snackbarOpen: true,
        severity: "success",
        rate: 0,
        sellerRate: 0,
      })
    );
  };

  const { mutate: createReport, isLoading: isReportCreating } = useCreateReport(
    onCreateReportSuccess
  );

  const [quantity, setQuantity] = React.useState<string>("1");
  const [price, setPrice] = useState<number>(initialPrice);
  const [openReportModal, setOpenReportModal] = useState<boolean>(false);
  const router = useRouter();
  const isLoggined = useContext(ContextApi).isLoggedIn;
  const isMobile: boolean = useMediaQuery("(max-width : 600px)");
  const isSmall: boolean = useMediaQuery("(max-width : 500px)");
  const isMatches: boolean = useMediaQuery("(max-width : 420px)");
  const [productQuantity, setProductQuantity] = useState<number>(quaty);
  const dispatch = useDispatch();
  const [color, setColor] = React.useState<string | null>("");
  const [quantities, setQuantities] = useState<number[]>([]);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const currency = useCurrency();

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isMobile ? "90vw" : "400px",
    // border: '2px solid #000',
    boxShadow: 24,
    display: "flex",
    bgcolor: "rgba(255,255,255,1)",
    color: "#363232",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 5,
    px: 3,
    py: 3,
  };

  useEffect(() => {
    const initialQuantities = [];
    for (let i = 1; i <= productQuantity; i++) {
      initialQuantities.push(i);
    }
    setQuantities(initialQuantities);
  }, [productQuantity]);

  useEffect(() => {
    const userFollowers = Cookies.get("usf");
    //  const userFollowers = localStorage.getItem("usf");

    if (
      userFollowers &&
      JSON.parse(userFollowers).includes(owner.owner._id.toString())
    ) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }

    const timeout = setTimeout(() => {
      const initialQuantities = [];
      for (let i = 1; i <= productQuantity; i++) {
        initialQuantities.push(i);
      }
      setQuantities(initialQuantities);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const handleColorChange = useCallback(
    (newColor: string | null) => {
      setColor(newColor);
    },
    [color]
  );
  type image = {
    original: string;
    thumbnail: string;
    loading: string;
    description: string;
  };
  const images: image[] = [];
  photo.forEach((image) => {
    const imageData = {
      original: image,
      thumbnail: image,
      loading: "lazy",
      description: "",
    };
    images.push(imageData);
  });
  const handleCartChange = useContext(ContextApi).handleCartChange;
  const [variants, setVariants] = useState<IMain[]>([]);
  const [storeId, setStoreId] = useState<string>("");
  const [productionConditionModal, setProductionConditionModal] = useState<boolean>(false);
  useEffect(() => {
    // const storeId = localStorage.getItem("storeId");
    const storeId = Cookies.get("storeId");

    if (storeId) setStoreId(storeId);
  }, []);
  const [showReviews, setShowReviews] = React.useState<boolean>(false);
  const [variantOption, setVariantOption] = useState<string>("");
  const [variantOption1, setVariantOption1] = useState<string>("");
  const [variantOption2, setVariantOption2] = useState<string>("");
  const [variantPrice1, setvariantPrice1] = useState<number>(0);
  const [variantPrice2, setVariantPrice2] = useState<number>(0);
  const [variantPrice3, setVariantPrice3] = useState<number>(0);
  const [variantStock, setVariantStock] = useState<number>(0);
  const [variantStock1, setVariantStock1] = useState<number>(0);
  const [variantStock2, setVariantStock2] = useState<number>(0);
  const [variantIndex, setVariantIndex] = useState<number>(0);
  const [variantIndex1, setVariantIndex1] = useState<number>(0);
  const [variantIndex2, setVariantIndex2] = useState<number>(0);
  const [currentQuantity, setCurrentQuantity] = useState<number>(0);
  const [variantPlaceholder, setVariantPlaceholder] = useState<number[]>([]);
  const [rate, setRate] = useState<number>(1);
  const [userInfo, setUserInfo] = useState(null)
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [variantPrice, setVariantPrice] = useState<number>(0);
  const [pricePlaceholder, setPricePlaceholder] = useState<number[]>([]);
  const [isCartShowing, setIsCartShowing] = useState(true);
  const [countryRate, setCountryRate] = useState<number>(1);
  const [currencySymbol, setCurrencySymbol] = useState<string>("$");

  useEffect(() => {
    const groupedVariant = groupByKey(initialVariant, "variant", {
      omitKey: true,
    });
    const variantPlaceholder: IMain[] = [];
    Object.entries(groupedVariant).map((x) => {
      const data = {
        variant: x[0] as string,
        options: x[1] as IVariant[],
      };
      variantPlaceholder.push(data);
    });
    setVariants(variantPlaceholder);
    const exchangeString = localStorage.getItem("exchange");
    if (JSON.parse(exchangeString)) {
      const localRate = JSON.parse(exchangeString)[`${owner?.currency}`];
      if (localRate) {
        setRate(Number(localRate));
      }
    }

    const userString = Cookies.get("userInfo");
    // const user = JSON.parse(localStorage.getItem("userInfo"));
    if (userString) {
      const user = JSON.parse(userString);
      setUserInfo(user);
    }

    async function init() {
      const rateRes: any = await getUserCurrencySymbol(userString);
      setCurrencySymbol(rateRes.symbol)
      setCountryRate(rateRes.rate)
    }
    setPrice(products.price)
    init();
  }, [products]);

  const handleLengthChange = useCallback(
    (data: number): string => {
      if (data === 2) return variantOption2;
      if (data === 1) return variantOption1;
      return variantOption;
    },
    [variantOption, variantOption2, variantOption1]
  );

  const handlePriceChange = useCallback(
    (data: number): number => {
      if (data === 2) return variantPrice3;
      if (data === 1) return variantPrice2;
      return variantPrice1;
    },
    [variantPrice3, variantPrice2, variantPrice1]
  );

  const handleAddToCart = () => {
    if (!isLoggined) return router.push("/login");
    if (owner?.owner?._id !== userInfo?.sellerId) {
      const newVariants: IVariants[] = [];
      let length: number = variantPlaceholder.length;
      let new_price = 0;
      for (let i = 0; i < length; i++) {
        const data: { variant: string; option: string } = {
          variant: variants[i].variant,
          option: handleLengthChange(i),
        };
        const priceChange = handlePriceChange(i);
        if (priceChange > new_price) {
          new_price = priceChange;
        }
        newVariants.push(data);
      }
      if (variants.length > 0 && newVariants.length < variants.length) {
        dispatch(
          snackBarOpen({
            message: "product.modal_data.warning",
            snackbarOpen: true,
            severity: "warning",
            rate: 0,
            sellerRate: 0,
          })
        );
        return;
      }
      const data = {
        productId: id,
        variants: newVariants,
        price: variantPlaceholder.length > 0 ? new_price : price,
        quantity: quantities[currentQuantity],
      };
      if (currentCount === quaty) return;
      addToCart(data);
      handleCartChange();
    } else {
      alert("You can't buy your own product");
    }
  };

  const onSuccess = () => {
    handleCartChange();
    setCurrentCount((prevState) => prevState + 1);
    // @ts-ignore
    dispatch(
      modalUserOpen({
        message: "product.modal_data.success_add_cart",
        image: "/assets/img/Shopping-bag.svg",
        modalType: "cart",
      })
    );
  };

  const addToWishlist = () => {
    if (!isLoggined) return router.push("/login");
    if (owner?.owner?._id !== userInfo?.sellerId) {
      if (variants.length > 0 && variantPlaceholder.length < variants.length) {
        dispatch(
          snackBarOpen({
            message: "product.modal_data.warning",
            snackbarOpen: true,
            severity: "warning",
            rate: 0,
            sellerRate: 0,
          })
        );
        return;
      }
      const newVariants: IVariants[] = [];
      let length: number = variantPlaceholder.length;
      for (let i = 0; i < length; i++) {
        const data: { variant: string; option: string } = {
          variant: variants[i].variant,
          option: handleLengthChange(i),
        };
        newVariants.push(data);
      }
      const data = {
        productId: id,
        price,
        quantity,
        variants: newVariants,
      };

      addToWish(data);
    } else {
      alert("You can't wishlist your own product");
    }
  };

  const handleVariantChange = useCallback(
    (
      index: number,
      id: number,
      price: number,
      color: string,
      stock: number
    ) => {
      handleColorChange(color);
      if (price > variantPrice) {
        setVariantPrice(price);
      }
      const length: number = variantPlaceholder.length;

      if (pricePlaceholder.length === length) {
        pricePlaceholder.shift();
      }
      pricePlaceholder.push(price);
      const existingIndex: number = variantPlaceholder.findIndex(
        (x) => x === index
      );
      if (existingIndex === -1) {
        const initialPlaceholder = variantPlaceholder;
        initialPlaceholder.push(index);
        setVariantPlaceholder(initialPlaceholder);
      }
      setProductQuantity(stock);
      setCurrentQuantity(0);
      switch (index) {
        case 0:
          firstStock = true;
          setVariantOption(color);
          setvariantPrice1(price);
          setVariantIndex(id);
          setVariantStock(stock);
          break;
        case 1:
          setVariantOption1(color);
          setVariantPrice2(price);
          setVariantIndex1(id);
          setVariantStock1(stock);
          secondStock = true;
          break;
        case 2:
          thirdStock = true;
          setVariantOption2(color);
          setVariantPrice3(price);
          setVariantStock2(stock);
          setVariantIndex2(id);
          break;
        default:
          setVariantOption(color);
      }
    },
    [variantPrice, variantPrice1, variantPrice2]
  );

  useEffect(() => {
    const highestPrice = getHighestNumber(variantPrice1, variantPrice2);

    if (highestPrice !== 0) {
      setPrice(highestPrice);
    }
  }, [variantPrice1, variantPrice2, variantPrice3]);

  // this logic below is responsible for handling the product quantity/stock based on the currently selected variant
  useEffect(() => {
    let initialStock: number[] = [];
    if (firstStock) {
      initialStock = [];
      for (let i = 1; i <= variantStock; i++) {
        initialStock.push(i);
      }
    }
    if (secondStock) {
      initialStock = [];
      const newVariantStock: number = firstStock
        ? getLowestStock([variantStock, variantStock1])
        : getLowestStock([variantStock1]);
      for (let i = 1; i <= newVariantStock; i++) {
        initialStock.push(i);
      }
    }
    if (thirdStock) {
      initialStock = [];
      const newVariantStock: number =
        firstStock && secondStock
          ? getLowestStock([variantStock, variantStock1, variantStock2])
          : firstStock
            ? getLowestStock([variantStock, variantStock2])
            : secondStock
              ? getLowestStock([variantStock1, variantStock2])
              : getLowestStock([variantStock2]);
      for (let i = 1; i <= newVariantStock; i++) {
        initialStock.push(i);
      }
    }
    if (firstStock) {
      setQuantities(initialStock);
    }
    if (secondStock) {
      setQuantities(initialStock);
    }
    if (thirdStock) {
      setQuantities(initialStock);
    }
  }, [variantStock1, variantStock, variantStock2]);

  //should work
  const onWishSuccess = () => {
    // @ts-ignore
    dispatch(
      modalUserOpen({
        message: "product.modal_data.success_add_wishlist",
        image: "/assets/img/Shopping-bag.svg",
        modalType: "wishlist",
      })
    );
  };

  // console.log(reviews);

  const { isLoading, mutate: addToCart } = useAddToCart(onSuccess);
  const { isLoading: isWishing, mutate: addToWish } =
    useAddUserWishlist(onWishSuccess);

  const handleIndex = useCallback(
    (index: number, option: string): boolean => {
      if (index === 0 && variantOption === option) return true;
      if (index === 1 && variantOption1 === option) return true;
      if (index === 2 && variantOption2 === option) return true;
      return false;
    },
    [variantPlaceholder, variantOption1, variantOption, variantOption2]
  );

  const isLoggedIn = useContext(ContextApi).isLoggedIn;

  const startChat = () => {
    if (!isLoggedIn) {
      router.push("/login");
    } else if (userInfo?.role === "seller") {
      if (owner?.owner?._id !== userInfo?.sellerId) {
        gotoConversation();
      } else {
        alert("You can't chat with yourself");
      }
    } else {
      gotoConversation();
    }
  };

  const gotoConversation = () => {
    const productDetail = {
      owner: owner?.owner?._id,
      id,
    };
    const roomName = `normalChat:${userInfo._id}:${id}`;
    localStorage.setItem("currentChatRoomName", roomName);
    localStorage.setItem("product_detail", JSON.stringify(productDetail));
    router.push("/chat");
  };

  const cartRef = useRef(null);
  const lastScrollPosition = useRef(0);

  useEffect(() => {
    const direction = () => {
      let scrollPos = window.pageYOffset || document.documentElement.scrollTop;
      if (lastScrollPosition.current > scrollPos) {
        lastScrollPosition.current = scrollPos;
        return "up";
      } else {
        lastScrollPosition.current = scrollPos;
        return "down";
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && direction() === "down") {
          setIsCartShowing(true);
        } else if (!entry.isIntersecting && direction() === "up") {
          setIsCartShowing(false);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.0,
      }
    );

    if (cartRef.current) {
      observer.observe(cartRef.current);
    }

    return () => {
      if (cartRef.current) {
        observer.unobserve(cartRef.current);
      }
    };
  }, []);

  const onFollowSuccess = (data) => {
    if (data.message === "Followed") {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }

    Cookies.set("usf", JSON.stringify(data.following), { expires: 3, secure: true });
  };

  const isCurrentUserSeller = () => {
    if (userInfo?._id.toString() === owner.owner.owner.toString()) return true;
    return false;
  };

  const { isLoading: followLoading, mutate: followSeller } =
    useFollowSeller(onFollowSuccess);

  const handleFollowRequest = () => {
    if (isLoggined) {
      followSeller(owner.owner._id.toString());
      return;
    }
    router.push("/login");
  };

  const ownerCountry = owner.owner.location;
  const ownerCountryData = countryCurrency.find(
    (value) => value.country.toLowerCase() === ownerCountry
  )

  const [userIpCountry, setCountry] = useState<string>("");

  useEffect(() => {
    if (localStorage.getItem("userIpCountry")) {
      const userIpCountry = localStorage.getItem("userIpCountry");
      setCountry(userIpCountry);
    } else {
      fetchIpAddress()
    }

  }, []);

  async function fetchIpAddress() {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();

    let locData;

    if (data) {
      const res = await fetch(`https://ipinfo.io/${data.ip}?token=6c18281e43a4a1`);
      locData = await res.json();
      setCountry(locData?.country);
    }
  }

  const userCountry = userInfo ? userInfo.country : userIpCountry;

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        // Clipboard successfully copied
      })
      .catch((error) => {
        // Error occurred while copying to clipboard
      });
  };
  return (
    <>
      <Nav />
      <ProductWrapper
        image={photo[0]}
        title={title}
        description={description}
        content={description}
      >
        {
          !showReviews && (
            <Grid container mt={isMobile && -2}>
              <Grid item xs={12} md={6}>
                <Box className="imageGalleryMax" position={"sticky"} sx={{
                  '& .image-gallery-thumbnail': {
                    borderRadius: "20px",
                    borderWidth: "2px",
                  },
                  '& .image-gallery-thumbnail:hover': {
                    borderColor: "var(--primary)",
                  },
                  '& .active': {
                    borderColor: "var(--primary)",
                  },
                  '& .image-gallery-image': {
                    borderRadius: !isMobile && "20px"
                  },
                  top: "65px"
                }}>
                  <Box sx={{
                    position: "absolute",
                    top: 16,
                    right: isSmall ? 10 : 88,
                    zIndex: 1000,
                    bgcolor: "white",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    p: 1,
                    cursor: "pointer",
                  }} onClick={() => {
                    dispatch(
                      snackBarOpen({
                        message: t("product.Product_Copied"),
                        severity: "success",
                        snackbarOpen: true,
                        rate: 0,
                        sellerRate: 0,
                      })
                    );
                  }}>

                    <ShareIcon
                      sx={{ color: "var(--primary)", fontSize: isSmall && 14 }}
                      onClick={handleCopyToClipboard}
                    />
                  </Box>
                  <ImageGallery
                    className={"imageGallery"}
                    showNav={false}
                    items={images}
                    showThumbnails={isMobile ? false : true}
                    showBullets={isMobile ? true : false}
                    showFullscreenButton={false}
                    showPlayButton={false}
                    lazyload={true}
                    loading="lazy"
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ boxShadow: "none" }}>
                  <Box
                    sx={{
                      p: 1,
                      m: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContext: "center",
                    }}
                  >
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Stack spacing={1} direction={"row"} alignItems={"center"}>
                        <Image
                          src={"https://res.cloudinary.com/linconstore-cloud/image/upload/f_auto,q_auto/v1/web-asset/jdvsotibh3nqh5fn2f5p"}
                          placeholder="blur"
                          blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
                          height={25}
                          width={25}
                          style={{ borderRadius: "50%" }}
                          className={"pointer"}
                          alt={"store image"}
                          onClick={() =>
                            router.push(
                              "/store/[slug]",
                              `/store/${slug(owner?.name)}`
                            )
                          }
                        />
                        <Typography
                          gutterBottom
                          variant="subtitle1"
                          component="div"
                          fontSize={isMobile ? "12px" : "16px"}
                          onClick={() =>
                            router.push(
                              "/store/[slug]",
                              `/store/${slug(owner?.name)}`
                            )
                          }
                        >
                          {owner?.name}
                        </Typography>
                        {!isCurrentUserSeller() && (
                          <Button
                            variant="outlined"
                            className="product__follow__btn"
                            size={"small"}
                            sx={{
                              borderColor: "red",
                              borderRadius: "45px",
                              fontWeight: 500,
                            }}
                            onClick={handleFollowRequest}
                          >
                            {followLoading
                              ? t("product.loading")
                              : isFollowing
                                ? t("product.unfollow")
                                : t("product.follow")}
                          </Button>
                        )}
                      </Stack>
                      <Box>
                        <ReportButton onClick={() => setOpenReportModal(true)}>
                          <InfoRounded
                            sx={{ width: "20px", marginRight: "3px", color: "Red" }}
                          />
                          <Typography fontSize={10} color={"red"}>
                            {t("product.report_seller")}
                          </Typography>
                        </ReportButton>
                      </Box>
                    </Stack>
                    <Stack
                      direction={"row"}
                      sx={{
                        justifyContent: "space-between",
                        mt: "10px",
                        mb: "5px",
                      }}
                    >
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        fontSize={"20px"}
                        width={"70%"}
                      >
                        {title}
                      </Typography>
                      <Typography
                        gutterBottom
                        color="primary"
                        component="div"
                        minWidth="60px"
                        fontSize={20}
                      >
                        {currencySymbol}&nbsp;&nbsp;
                        {((price * currency(owner.currency)) / countryRate).toFixed(2)}
                      </Typography>
                    </Stack>

                    <Stack
                      direction={"row"}
                      sx={{
                        justifyContent: "space-between",
                      }}
                    >
                      <Stack direction={"row"} spacing={1}>
                        <Typography fontSize={12}>{products.quantity}</Typography>
                        <Typography fontSize={12}>
                          {t("product.left_in_stock")}
                        </Typography>
                      </Stack>

                      <Button sx={{ textTransform: "capitalize" }} onClick={() => dispatch(openCloseBuyerProtectionModal(true))}>
                        <Stack flexDirection={"row"} alignItems={"center"}>
                          <VerifiedUser className={"icon-green"} />

                          <Typography fontSize={12}>
                            {t("product.buyer_protection")}
                          </Typography>
                        </Stack>
                      </Button>
                    </Stack>

                    {variants.length > 0 &&
                      variants.map((x, index) => (
                        <Box key={index}>
                          <Typography variant={"caption"}>{x.variant}</Typography>
                          <Grid container spacing={isMatches ? 3 : 1}>
                            {x.options.map((y, id) => (
                              <Grid
                                key={id}
                                item
                                xs={"auto"}
                                sm={"auto"}
                                md={"auto"}
                                lg={"auto"}
                                xl={"auto"}
                              >
                                <Button
                                  disabled={y.stock === 0}
                                  onClick={() =>
                                    handleVariantChange(
                                      index,
                                      id,
                                      y.price,
                                      y.option,
                                      y.stock
                                    )
                                  }
                                  className={
                                    handleIndex(index, y.option)
                                      ? "product__variant__active"
                                      : "product__variant"
                                  }
                                  variant={"outlined"}
                                  sx={{
                                    maxWidth: isMatches ? 140 : "auto",
                                    borderRadius: "25px",
                                  }}
                                >
                                  {y.option}
                                </Button>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      ))}

                    <Stack
                      direction={"row"}
                      mt={2}
                      alignItems={"center"}
                      sx={{ justifyContent: "space-between" }}
                    >
                      {/* create a dropdown to select quantity, a favorite icon and an add to cart button  */}
                      <Box width={100}>
                        <FormControl fullWidth>
                          <Stack
                            direction={"row"}
                            spacing={2}
                            alignItems={"center"}
                          >
                            <IconButton
                              sx={{ padding: "0" }}
                              onClick={() => {
                                if (currentQuantity == 0) return;
                                setCurrentQuantity(currentQuantity - 1);
                              }}
                            >
                              <IndeterminateCheckBoxOutlined className="icon-green" />
                            </IconButton>

                            <Typography>{quantities[currentQuantity]}</Typography>

                            <IconButton
                              sx={{ padding: "0" }}
                              onClick={() => {
                                if (currentQuantity === quantities.length - 1)
                                  return;
                                setCurrentQuantity(currentQuantity + 1);
                              }}
                            >
                              <AddBoxOutlined className="icon-green" />
                            </IconButton>
                          </Stack>
                        </FormControl>
                      </Box>
                      <Box>
                        <sup>
                          <Button onClick={() => setProductionConditionModal(true)} sx={{ textTransform: "capitalize" }}>
                            <Stack flexDirection={"row"} alignItems={"center"}>
                              <InfoOutlined className={"icon-green"} />
                              <Typography fontSize={12}>
                                {t(`FilterItems.${condition}`)}
                              </Typography>
                            </Stack>
                          </Button>
                        </sup>
                      </Box>
                    </Stack>
                    <Stack spacing={2} sx={{ my: 2 }}>
                      <Typography fontSize={15}>
                        {t("product.description")}
                      </Typography>

                      <Typography
                        className="product__decription__detial"
                        fontSize={14}
                      >
                        {products.description}
                      </Typography>
                    </Stack>
                    <Stack spacing={2} sx={{ mb: 1 }}>
                      {
                        owner.disableChat ?
                          <Box
                            sx={{
                              display: "flex",
                              alignSelf: "flex-end",
                              position: "fixed",
                              bottom: isMobile ? "3.5rem" : "2rem",
                              my: 2,
                              cursor: "pointer",
                              bgcolor: "gray",
                              width: isMobile ? "3rem" : "4rem",
                              height: isMobile ? "3rem" : "4rem",
                              borderRadius: "50%",
                              alignItems: "center",
                              justifyContent: "center",
                              zIndex: 10,
                            }}
                          >
                            <SmsOutlined fontSize={isMobile ? "medium" : "large"} />
                          </Box>
                          :
                          <Box
                            sx={{
                              display: "flex",
                              alignSelf: "flex-end",
                              position: "fixed",
                              bottom: isMobile ? "3.5rem" : "2rem",
                              my: 2,
                              cursor: "pointer",
                              bgcolor: "#00a859",
                              width: isMobile ? "3rem" : "4rem",
                              height: isMobile ? "3rem" : "4rem",
                              borderRadius: "50%",
                              alignItems: "center",
                              justifyContent: "center",
                              zIndex: 10,
                            }}
                            onClick={startChat}
                          >
                            {/* <Forum className={"pointer"} fontSize={"large"} /> */}
                            <SmsOutlined fontSize={isMobile ? "medium" : "large"} />
                          </Box>
                      }
                      {!isMobile && (
                        <>
                          {!owner.sellGlobal && (ownerCountryData.abb !== userCountry) &&
                            <Box style={{ color: "red", display: "flex" }}><WarningIcon />{t("product.not_ship_region")}</Box>
                          }

                          {/* {ownerCountryData.abb}-----{userCountry} */}
                          <Stack
                            spacing={1}
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Button
                              disabled={isLoading || storeId === owner._id || (!owner.sellGlobal && (ownerCountryData.abb !== userCountry))}
                              size={isMobile ? "small" : "large"}
                              className={"product__action__btn"}
                              endIcon={<ShoppingBagIcon />}
                              variant="outlined"
                              onClick={() => handleAddToCart()}
                              sx={{ fontSize: 14, fontWeight: 500 }}
                            >
                              {t("product.btn_add_to_cart")}{" "}
                              {isLoading && <CircularProgress />}
                            </Button>
                            <Button
                              size={isMobile ? "small" : "large"}
                              disabled={isLoading || storeId === owner._id || (!owner.sellGlobal && (ownerCountryData.abb !== userCountry))}
                              variant="outlined"
                              className={"product__action__btn"}
                              endIcon={<FavoriteBorder />}
                              onClick={() => addToWishlist()}
                              sx={{ fontSize: 14, fontWeight: 500 }}
                            >
                              {t("product.btn_add_wishlist")}
                            </Button>
                          </Stack>
                        </>
                      )}
                    </Stack>
                    {isMobile && !isCartShowing && (
                      <Paper
                        sx={{
                          mt: 1,
                          padding: "1rem",
                          borderRadius: "2px",
                          p: { xs: 0, sm: 2 },
                          boxShadow: "none",
                          position: "fixed",
                          bottom: "70px",
                          left: "1rem",
                          width: "calc(100% - 6rem)",
                        }}
                      >
                        {!owner.sellGlobal && (ownerCountryData.abb !== userCountry) &&
                          <Box style={{ color: "red", display: "flex" }}><WarningIcon />{t("product.not_ship_region")}</Box>
                        }
                        <Stack
                          spacing={1}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Button
                            disabled={isLoading || storeId === owner._id || (!owner.sellGlobal && (ownerCountryData.abb !== userCountry))}
                            size={"large"}
                            className={"product__action__btn"}
                            endIcon={<ShoppingBagIcon sx={{ m: 0 }} />}
                            variant="outlined"
                            onClick={() => handleAddToCart()}
                            sx={{ width: "50%", fontWeight: 500 }}
                          >
                            {isLoading && <CircularProgress />}
                          </Button>
                          <Button
                            size={"large"}
                            disabled={isLoading || storeId === owner._id || (!owner.sellGlobal && (ownerCountryData.abb !== userCountry))}
                            variant="outlined"
                            className={"product__action__btn"}
                            endIcon={<FavoriteBorder sx={{ m: 0 }} />}
                            onClick={() => addToWishlist()}
                            sx={{ width: "50%", fontWeight: 500 }}
                          />
                        </Stack>
                      </Paper>
                    )}
                    {isMobile && (
                      <Paper
                        sx={{
                          mt: 1,
                          padding: "1rem",
                          borderRadius: "2px",
                          p: { xs: 0, sm: 2 },
                          boxShadow: "none",
                        }}
                      >
                        {!owner.sellGlobal && (ownerCountryData.abb !== userCountry) &&
                          <Box style={{ color: "red", display: "flex" }}><WarningIcon />{t("product.not_ship_region")}</Box>
                        }
                        <Stack
                          spacing={1}
                          direction="column"
                          justifyContent="space-between"
                          alignItems="center"
                          ref={cartRef}
                        >
                          <Button
                            disabled={isLoading || storeId === owner._id || (!owner.sellGlobal && (ownerCountryData.abb !== userCountry))}
                            size={isMobile ? "small" : "large"}
                            className={"product__action__btn"}
                            endIcon={<ShoppingBagIcon />}
                            variant="outlined"
                            onClick={() => handleAddToCart()}
                            sx={{ minWidth: "100%", fontWeight: 500 }}
                          >
                            {t("product.btn_add_to_cart")}{" "}
                            {isLoading && <CircularProgress />}
                          </Button>
                          <Button
                            size={isMobile ? "small" : "large"}
                            disabled={isLoading || storeId === owner._id || (!owner.sellGlobal && (ownerCountryData.abb !== userCountry))}
                            variant="outlined"
                            className={"product__action__btn"}
                            endIcon={<FavoriteBorder />}
                            onClick={() => addToWishlist()}
                            sx={{ minWidth: "100%", fontWeight: 500 }}
                          >
                            {t("product.btn_add_wishlist")}
                          </Button>
                        </Stack>
                      </Paper>
                    )}

                    <SimpleAccordion care={instruction} shipping={shippingDetail} />
                    {reviews.length > 0 && (
                      <Box>
                        <Product_reviews reviews={reviews.slice(0, 2)} />
                        <Box
                          display={"flex"}
                          justifyContent={"center"}
                          alignItems={"center"}
                          pb={1}
                          gap={1}
                          onClick={() => setShowReviews(true)}
                          sx={{ cursor: "pointer" }}
                        >
                          <Grade sx={{ fontSize: 14 }} />
                          <Typography fontSize={14}>Read More</Typography>
                        </Box>
                      </Box>
                    )}

                    <Box display={"flex"} flexDirection={"column"} gap={2}>
                      <Box>
                        {mProducts && mProducts.length > 0 && <>
                          <Typography sx={{ mt: "20px" }}>{t("product.label_more_from_seller")}</Typography>
                          <Swiper
                            effect={"fade"}
                            breakpoints={{
                              // when window width is >= 240px
                              240: {
                                slidesPerView: 1,
                                spaceBetween: 10,
                              },
                              // when window width is >= 340px
                              340: {
                                slidesPerView: 2,
                                spaceBetween: 10,
                              },
                              // when window width is >= 640px
                              640: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                              },
                              // when window width is >= 840px
                              840: {
                                slidesPerView: 3,
                                spaceBetween: 10,
                              },
                            }}
                            autoplay={{
                              delay: 3000,
                              disableOnInteraction: false,
                            }}
                          >
                            {mProducts?.map((value, index) => {
                              return (
                                <SwiperSlide key={index}>
                                  <ProductCards
                                    calculateRate={true}
                                    percent={false}
                                    owner={value.owner}
                                    image={value.photo}
                                    price={value.price}
                                    name={value.title}
                                    rating={value.ratingId}
                                    id={value._id}
                                    discount={value.discount}
                                    countryRate={countryRate}
                                    currencySymbol={currencySymbol}
                                  />
                                </SwiperSlide>
                              );
                            })}
                          </Swiper>
                        </>
                        }
                        {sProducts && sProducts.length > 0 && <>
                          <Typography sx={{ mt: "20px" }}>{t("product.label_similar_product")}</Typography>
                          <Swiper
                            effect={"fade"}
                            breakpoints={{
                              // when window width is >= 240px
                              240: {
                                slidesPerView: 1,
                                spaceBetween: 10,
                              },
                              // when window width is >= 340px
                              340: {
                                slidesPerView: 2,
                                spaceBetween: 10,
                              },
                              // when window width is >= 640px
                              640: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                              },
                              // when window width is >= 840px
                              840: {
                                slidesPerView: 3,
                                spaceBetween: 10,
                              },
                            }}
                            autoplay={{
                              delay: 3000,
                              disableOnInteraction: false,
                            }}
                          >
                            {sProducts?.map((value, index) => {
                              return (
                                <SwiperSlide key={index}>
                                  <ProductCards
                                    calculateRate={true}
                                    percent={false}
                                    owner={value.owner}
                                    image={value.photo}
                                    price={value.price}
                                    name={value.title}
                                    rating={value.ratingId}
                                    id={value._id}
                                    discount={value.discount}
                                    countryRate={countryRate}
                                    currencySymbol={currencySymbol}
                                  />
                                </SwiperSlide>
                              );
                            })}
                          </Swiper>
                        </>
                        }

                        {aProducts && aProducts.length > 0 && <>
                          <Typography sx={{ mt: "20px" }}>{t("product.label_ads_product")}</Typography>
                          <Swiper
                            effect={"fade"}
                            breakpoints={{
                              // when window width is >= 240px
                              240: {
                                slidesPerView: 1,
                                spaceBetween: 10,
                              },
                              // when window width is >= 340px
                              340: {
                                slidesPerView: 2,
                                spaceBetween: 10,
                              },
                              // when window width is >= 640px
                              640: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                              },
                              // when window width is >= 840px
                              840: {
                                slidesPerView: 3,
                                spaceBetween: 10,
                              },
                            }}
                            autoplay={{
                              delay: 3000,
                              disableOnInteraction: false,
                            }}
                          >
                            {aProducts?.map((value, index) => {
                              if (value.productId) {
                                return (
                                  <SwiperSlide key={index}>
                                    <ProductCards
                                      calculateRate={true}
                                      percent={false}
                                      owner={value.productId.owner}
                                      image={value.productId.photo}
                                      price={value.productId.price}
                                      name={value.productId.title}
                                      rating={value.productId.ratingId}
                                      id={value.productId._id}
                                      discount={value.productId.discount}
                                      countryRate={countryRate}
                                      currencySymbol={currencySymbol}
                                    />
                                  </SwiperSlide>
                                );
                              }
                            })}
                          </Swiper>
                        </>
                        }
                      </Box>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          )
        }
        {
          showReviews && (
            <Box bgcolor={"white"} mt={2}>
              <Product_reviews reviews={reviews} showReviews />
              <Box sx={{textAlign: "center", m: 1.5}}>
                <Button variant="contained" onClick={() => setShowReviews(false)}>Go Back</Button>
              </Box>
            </Box>
          )
        }

        <BuyerProtectionModal />

        <Modal
          open={openReportModal}
          onClose={() => setOpenReportModal(false)}
          sx={{
            bottom: isMobile ? 50 : 0,
          }}
        >
          <Box
            sx={{
              position: "absolute" as "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: isMatches ? "95vw" : 340,
              bgcolor: "background.paper",
              borderRadius: "20px",
              boxShadow: 24,
              pb: 4,
            }}
          >
            <Box
              borderBottom="1px solid #c3c3c3"
              px={4}
              pt={4}
              pb={3}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6" component="h2" fontSize={14}>
                {t("product.Whats_wrong")}
              </Typography>
              <Box
                sx={{ cursor: "pointer" }}
                onClick={() => setOpenReportModal(false)}
              >
                <Close />
              </Box>
            </Box>
            <Box px={4}>
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <FormControl fullWidth>
                  <Controller
                    name="reason"
                    control={control}
                    render={({ field }) => (
                      <Box border="1px solid #c3c3c3" px={4} py={1} my={1}>
                        <RadioGroup {...field}>
                          <FormControlLabel
                            value="Fraud or scam"
                            control={<Radio size="small" />}
                            sx={{
                              "& span": {
                                fontSize: 12,
                              },
                            }}
                            label={t("product.Fraud_or_scam")}
                          />
                          <FormControlLabel
                            value="Unwanted messages"
                            control={<Radio size="small" />}
                            sx={{
                              "& span": {
                                fontSize: 12,
                              },
                            }}
                            label={t("product.Unwanted_messages")}
                          />
                          <FormControlLabel
                            value="Pretending to be something"
                            control={<Radio size="small" />}
                            sx={{
                              "& span": {
                                fontSize: 12,
                              },
                            }}
                            label={t("product.Pretending_to_be_something")}
                          />
                          <FormControlLabel
                            value="Sharing inappropriate things"
                            control={<Radio size="small" />}
                            sx={{
                              "& span": {
                                fontSize: 12,
                              },
                            }}
                            label={t("product.Sharing_inappropriate_things")}
                          />
                          <FormControlLabel
                            value="Hate speech"
                            sx={{
                              "& span": {
                                fontSize: 12,
                              },
                            }}
                            control={<Radio size="small" />}
                            label={t("product.Hate_speech")}
                          />
                          <FormControlLabel
                            value="Harassment"
                            control={<Radio size="small" />}
                            sx={{
                              "& span": {
                                fontSize: 12,
                              },
                            }}
                            label={t("product.Harassment")}
                          />
                          <FormControlLabel
                            value="Unauthorised sales"
                            control={<Radio size="small" />}
                            sx={{
                              "& span": {
                                fontSize: 12,
                              },
                            }}
                            label={t("product.Unauthorized_sales")}
                          />
                          <FormControlLabel
                            value="Other"
                            control={<Radio size="small" />}
                            sx={{
                              "& span": {
                                fontSize: 12,
                              },
                            }}
                            label={t("product.Other")}
                          />
                        </RadioGroup>
                      </Box>
                    )}
                  />
                </FormControl>
                <Button type="submit" variant="contained" fullWidth>
                  {isReportCreating && <CircularProgress />}{" "}
                  {t("address.Submit_Report")}
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>

        <Modal
          open={productionConditionModal}
          onClose={() => setProductionConditionModal(false)}
        >
          <Container maxWidth={"md"} component={"main"}>
            <Box sx={style}>
              <Box
                display={"flex"}
                flexDirection={"column"}
                gap={2}
                my={2}
                width={"100%"}
              >
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Typography variant={"subtitle1"}>
                    {t("product.Product_Condition")}
                  </Typography>
                  <IconButton
                    onClick={() => setProductionConditionModal(false)}
                    aria-label="Close"
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>
              <Typography my={2}>
                {t(
                  "product.This_shows_the_condition_of_the_production_you_are_viewing"
                )}
              </Typography>
              <Typography textAlign={"start"} width={"100%"}>
                {t("product.New_or_Used")}
              </Typography>
            </Box>
          </Container>
        </Modal>
      </ProductWrapper>
      <LanguageModalComponet />
    </>
  );
};
export default Product;

const ReportButton = styled(Button)({
  ":hover": {
    boxShadow: "none",
    background: "none",
  },
  ":focus": {
    boxShadow: "none",
    background: "none",
  },
});
