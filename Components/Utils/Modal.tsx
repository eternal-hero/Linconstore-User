import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import { modalClose } from "../../Store/Modal";
import Container from "@mui/material/Container";
import { Stack, useMediaQuery } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

interface modal {
  modal: {
    modalOpen: boolean;
    message: string;
    image: string;
    modalType: 'cart' | 'wishlist',
  };
}

export default function MainModal() {
  const isMobile = useMediaQuery("(max-width: 500px)");
  const { t } = useTranslation();
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isMobile ? 200 : 400,
    bgcolor: "background.paper",
    // border: '2px solid #000',
    boxShadow: 24,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxHeight: "auto",
    borderRadius: 5,
    p: 1,
  };
  const dispatch = useDispatch();
  // const open: boolean = useSelector((state: modal) => state.modal.modalOpen);
  // const message: string = useSelector((state: modal) => state.modal.message);
  // const image: string = useSelector((state: modal) => state.modal.image);
  const {modalOpen:open, message, image, modalType} = useSelector((state: modal) => state.modal);
  const router = useRouter();

  const handleClose = () => dispatch(modalClose());
  const handleCart = () => {
    handleClose();
    router.push("/cart");
  };

  const handleWishList = () => {
    handleClose();
    router.push("/wishlist");
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Container maxWidth={"xs"} component={"main"}>
        <Box sx={style}>
          <Image
            width={250}
            height={110}
            style={{ width: "100%", height: "100%" }}
            placeholder="blur"
            blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
            src={image}
          />
          <Typography align="center" fontSize={20}>
            {t("product.modal_data.success_title")}
          </Typography>
          <Typography
            gutterBottom
            align="center"
            id="modal-modal"
            variant="body1"
            component="h6"
            fontSize={12}
          >
            {t(message)}
          </Typography>
          <Stack sx={{ alignItems: "center" }} spacing={2}>
            <Button
              variant="contained"
              sx={{ borderRadius: "25px", fontSize: 11, fontWeight: 400 }}
              color="success"
              onClick={handleClose}
            >
              {t("product.modal_data.continue_shopping")}
            </Button>
            <Button
              sx={{ borderRadius: 20, fontSize: 11, fontWeight: 400 }}
              variant={"outlined"}
              color={"inherit"}
              onClick={modalType === 'cart' ? handleCart : handleWishList}
            >
              {modalType === 'cart'
                ? t("product.modal_data.btn_go_to_cart")
                : t("product.modal_data.btn_go_to_wishList")
              }
            </Button>
          </Stack>
        </Box>
      </Container>
    </Modal>
  );
}
