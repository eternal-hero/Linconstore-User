import AccordionSummary from "@mui/material/AccordionSummary";
import {
  CircularProgress,
  FormHelperText,
  Stack,
  TextField,
  useMediaQuery,
} from "@mui/material";
import {
  CheckBoxOutlineBlank,
  CheckBoxOutlined,
} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";
import * as React from "react";
import { Print } from "@mui/icons-material";
import * as yup from "yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import Image from "next/image";
import {
  useUpdateOrder,
  useCheckInvoiceDownload,
} from "../../hooks/useDataFetch";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import { reCreateDate } from "../../Helpers/getDate";
import { useTranslation } from "react-i18next";
import ContextApi from "../../Store/context/ContextApi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useDispatch } from "react-redux";
import Invoice from '../Invoice';

interface INewOrders {
  order: any;
  address: any;
  onCompleted?: () => void;
}
type Iupdate = {
  shipping: string;
  id: string;
  key: number;
};
const schema = yup.object().shape({
  shipping: yup.string().required(),
  id: yup.string().required(),
});
const OrdersAccordion: React.FC<INewOrders> = ({
  order,
  address,
  onCompleted,
}) => {
  const {
    createdAt,
    updatedAt,
    productId,
    userId,
    _id,
    quantity,
    variants,
    shipping,
    trackingId,
    shippingProvider,
    status,
    type,
    active,
  } = order;
  const title = productId?.title;
  const firstName = userId?.firstName;
  const lastName = userId?.lastName;
  const orderId = _id;
  const {
    handleSubmit,
    control,
    getValues,
    reset,
    setValue,
    formState: { isValid },
  } = useForm<Iupdate>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      shipping: shippingProvider,
      id: trackingId,
    },
  });
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [updateEnabled, setUpdateEnabled] = useState<boolean>(
    status === "placed" ? true : false
  );
  const onSubmit: SubmitHandler<Iupdate> = (data) => {
    if (!updateEnabled) {
      setUpdateEnabled(true);
      return;
    }
    const { id, shipping } = data;
    const update = {
      trackingId: id,
      shippingProvider: shipping,
      id: orderId,
      status: status !== "placed" ? status : "processed",
    };
    updateOrder(update);
    setUpdateEnabled(false);
  };
  const updateOrderToShipped = useCallback(() => {
    const data = {
      status: "shipped",
      id: orderId,
    };
    updateOrder(data);
  }, []);
  const [validName, setValidName] = useState<boolean>(false);
  useEffect(() => {
    if (firstName === undefined || lastName === undefined)
      return setValidName(false);

    setValidName(true);
  }, [firstName, lastName]);
  const onUpdateSuccess = () => {
    reset();
    setUpdateEnabled(true);
    onCompleted();
    router.reload();
  };

  const {
    isLoading,
    mutate: updateOrder,
    isError,
    error,
  } = useUpdateOrder(onUpdateSuccess);
  const [errorMessage, setErrorMessage] = useState("");
  const [checked, setChecked] = useState<boolean>(false);
  const sellerIsActive = useContext(ContextApi).sellerIsActive;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked((prevState) => !prevState);
    updateOrderToShipped();
  };
  useEffect(() => {
    if (error instanceof Error) {
      //  @ts-ignore
      setErrorMessage(error?.response?.data?.status);
    }
  }, [isError]);
  const isMobile: boolean = useMediaQuery("(max-width: 600px)");

  const isShippedOrder = (status) => {
    if (
      status === "shipped" ||
      status === "cancelled" ||
      status === "delivered"
    )
      return true;
    return false;
  };

  const checkSuccess = (data: any) => {
    if (data.downloadable) {
      const input = document.getElementById(`divToPrint_${order._id}`);
      html2canvas(input, {
        onclone: function (clonedDoc) {
          clonedDoc.getElementById(`divToPrint_${order._id}`).style.display = 'block';
        },
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        pdf.addImage(imgData, "JPEG", 10, 20, 180, 0);
        pdf.save(`${address.firstName ?? "Seller"}-${address.lastName ?? "name"}-shipping-invoice.pdf`);
      });
    } else {
      alert(
        "You can't download any more. Please subscribe to premium for unlimited shipping slip."
      );
    }
  };

  const { mutate: handleCheck, isLoading: isDeleting } =
    useCheckInvoiceDownload(checkSuccess);

  const handlePrinter = useCallback(() => {
    handleCheck({ order });
  }, []);

  return (
    <>
      <Accordion
        sx={{
          my: 2,
          opacity: 1,
          boxShadow: "none",
          "&:before": {
            bgcolor: "transparent",
          },
        }}
      >
        <AccordionSummary
          sx={{
            boxShadow: "none",
            px: 1,
            py: 0,
            "& .MuiAccordionSummary-expandIconWrapper": {
              transition: "none",
              "&.Mui-expanded": {
                transform: "none",
              },
            },
            "&.Mui-disabled": {
              opacity: 1,
            },
            "& .MuiAccordionSummary-content": {
              alignItems: "center",
              my: 1,
              p: 0,
            },
          }}
          expandIcon={
            <Stack direction={"row"}>
              {/* <Typography
              color={status === "cancelled" ? "red" : "black"}
              // sx={{ mt: isMobile ? 0.6 : 0 }}
              // variant={isMobile ? "body2" : "h6"}
              fontSize={12}
            >
              {t("seller.orderProcessed.detail.btn_view")}
            </Typography> */}
              <Box>
                <ExpandCircleDownIcon />
              </Box>
              {type === "shipped" && (
                <Stack spacing={0.5}>
                  <Box /> <CheckBoxOutlined sx={{ mt: 5 }} />
                </Stack>
              )}
              {type === "processed" && (
                <Stack spacing={0.5}>
                  <Box /> <CheckBoxOutlineBlank sx={{ mt: 5 }} />
                </Stack>
              )}
            </Stack>
          }
          aria-controls="panel2a-content"
          id="panel2a-header"
          disabled={status === "cancelled"}
        >
          {/* <Grid container>
          <Grid item xs={8} md={9} lg={10}>
            <Typography
              color={"black"}
              variant={isMobile ? "body2" : "h6"}
              sx={{ opacity: "1" }}
            >
              {t("seller.orderProcessed.detail.order_id")} : {orderId}
            </Typography>
          </Grid>
          
        </Grid> */}
          {/* <Box display={"flex"} gap={1} className="12"> */}
          <Box width={35} height={35}>
            <Image
              width={35}
              height={35}
              style={{
                width: "100%",
                height: "100%",
              }}
              placeholder="blur"
              blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
              src={productId?.photo[0]}
              alt={"image of review"}
            />
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            width={"100%"}
            alignItems={"center"}
          >
            <Box display={"flex"} flexDirection={"column"} ml={!isMobile ? 3 : 1}>
              <Typography fontSize={12}>
                {t("seller.orderProcessed.detail.order_id")}: {orderId}
              </Typography>
              <Typography
                fontSize={12}
                sx={{
                  width: "150px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {title}
              </Typography>
            </Box>

            <Box display={isMobile ? "none" : "flex"} flexDirection={"column"}>
              <Typography fontSize={12}>
                {" "}
                {t("seller.orderProcessed.detail.Unit")} - {quantity}
              </Typography>
              {status !== "cancelled" ? (
                <Typography fontSize={12}>
                  {" "}
                  {t("seller.orderProcessed.detail.Shipping")} -{" "}
                  {t(`order.${shipping}`)}{" "}
                </Typography>
              ) : (
                <Typography fontSize={12}>
                  {" "}
                  {t("OrderDetail.Cancelled")} {type}
                </Typography>
              )}
            </Box>

            <Box
              display={isMobile ? "none" : "flex"}
              flexDirection={"column"}
              mr={3}
            >
              <Typography fontSize={12}>{reCreateDate(updatedAt)}</Typography>
            </Box>
          </Box>

          {/* </Box> */}
        </AccordionSummary>
        <AccordionDetails>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            flexDirection={isMobile ? "column" : "row"}
            gap={3}
          >
            <Box display={"flex"} flexDirection={"column"}>
              <Typography fontSize={12} mb={1}>
                {t("seller.orderProcessed.detail.order_name")} -{" "}
                {address?.firstName} {address?.lastName}
              </Typography>
              <Typography fontSize={12}>
                {t("seller.orderProcessed.detail.order_address")} -{" "}
                {address?.address}
              </Typography>
              <Typography fontSize={12}>
                {t("seller.orderProcessed.detail.order_city")} - {address?.city}
              </Typography>
              <Typography fontSize={12}>
                {t("seller.orderProcessed.detail.order_zipCode")} -{" "}
                {address?.zipCode}
              </Typography>
              <Typography fontSize={12}>
                {t("seller.orderProcessed.detail.order_country")} -{" "}
                {address?.country}
              </Typography>
              <Typography fontSize={12} mt={1}>
                {t("seller.orderProcessed.detail.order_phone")} -{" "}
                {address?.phoneNumber}
              </Typography>
            </Box>

            <Box display={"flex"} flexDirection={"column"} gap={1}>
              <Box display={"flex"} flexDirection={"column"}>
                <Typography fontSize={12} fontWeight={800}>
                  {t("seller.orderProcessed.detail.Product")}
                </Typography>
                <Typography fontSize={12}>{title}</Typography>
              </Box>
              {variants.length > 0 && (
                <Box display={"flex"} flexDirection={"column"}>
                  <Typography fontSize={12} fontWeight={800}>
                    {t("seller.orderProcessed.detail.Variant")}
                  </Typography>
                  {variants.map((variant, index) => (
                    <Typography
                      key={index + variant.variant + variant.option}
                      fontSize={12}
                    >
                      {variant.variant}: {variant.option}
                    </Typography>
                  ))}
                </Box>
              )}
              <Box display={isMobile ? "none" : "flex"}>
                {!isShippedOrder(status) && (
                  <Box
                    display={"flex"}
                    borderRadius={20}
                    gap={1}
                    justifyContent={"start"}
                    alignItems={"center"}
                    onClick={handlePrinter}
                    sx={{ cursor: "pointer" }}
                  >
                    <Print />
                    <Typography fontSize={12}>
                      {t("seller.orderProcessed.detail.Print")}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            <Box display={!isMobile ? "none" : "flex"} flexDirection={"column"}>
              <Typography fontSize={12}>
                {" "}
                {t("seller.orderProcessed.detail.Unit")} - {quantity}
              </Typography>
              <Typography fontSize={12}>
                {" "}
                {t("seller.orderProcessed.detail.Shipping")} -{" "}
                {t(`order.${shipping}`)}{" "}
              </Typography>
            </Box>
            <Box display={!isMobile ? "none" : "flex"} flexDirection={"column"} mr={3}>
              {!isShippedOrder(status) && <Box display={"flex"} borderRadius={20} gap={1} justifyContent={!isMobile ? "center" : "start"} alignItems={"center"} onClick={handlePrinter}>
                <Print />
                <Typography fontSize={12}>{t("seller.orderProcessed.detail.Print")}</Typography>
              </Box>}
              <Typography fontSize={12}>{reCreateDate(createdAt)}</Typography>
            </Box>
            <Box
              display={"flex"}
              flexDirection={"column"}
              gap={1}
              component="form"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Controller
                name="shipping"
                control={control}
                render={({ field, formState: { errors } }) => (
                  <TextField
                    error={!!errors?.shipping}
                    size="small"
                    helperText={errors?.shipping?.message}
                    {...field}
                    disabled={!updateEnabled}
                    label={t("seller.orderProcessed.detail.shipping_provider")}
                  />
                )}
              />
              <Controller
                name="id"
                control={control}
                render={({ field, formState: { errors } }) => (
                  <TextField
                    error={!!errors?.id}
                    size="small"
                    helperText={errors?.id?.message}
                    {...field}
                    disabled={!updateEnabled}
                    label={t("seller.orderProcessed.detail.tracking_id")}
                  />
                )}
              />
              {isError && (
                <FormHelperText sx={{ color: "red" }}>
                  {errorMessage}
                </FormHelperText>
              )}
              {status !== "delivered" && (
                <Box display={"flex"} justifyContent={"end"}>
                  <Button
                    variant="outlined"
                    size="small"
                    type={"submit"}
                    disabled={
                      !active ||
                        status === "cancelled" ||
                        type === "shipped" ||
                        !sellerIsActive
                        ? !isValid
                        : false
                    }
                  >
                    {t("seller.orderProcessed.detail.btn_update")}
                    {isLoading && <CircularProgress />}
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Box id={`divToPrint_${order._id}`} className="mt4" sx={{ display: "none" }}>
        <Invoice order={order} user={address} />
      </Box>
    </>
  );
};
export default OrdersAccordion;
