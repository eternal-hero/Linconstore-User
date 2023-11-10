
import * as React from "react";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import { closeTermModal } from "../../../Store/Modal";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";

interface modal {
  modal: {
    termModal: boolean;
  };
}
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  minWidth: "280px",
  // border: '2px solid #000',
  boxShadow: 24,
  display: "flex",
  bgcolor: "rgba(255,255,255,1)",
  color: "#363232",
  flexDirection: "column",
  alignItems: "center",
  height: 400,
  overflow: "auto",
  borderRadius: 5,
  p: 1,
};

export default function TermModal() {
  const dispatch = useDispatch();
  const open: boolean = useSelector((state: modal) => state.modal.termModal);
  const handleClose = () => dispatch(closeTermModal());
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Container maxWidth={"md"} component={"main"}>
        <Box sx={style}>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ width: "200", alignSelf: "flex-end" }}>
            <Button
              onClick={handleClose}
              color={"error"}
              startIcon={<Close />}
              size={"small"}
              variant={"outlined"}
            >
              {t("seller.verify.term.btn_close")}
            </Button>
          </Box>
          <Box sx={{ mx: 3, mb: 2 }}>
            <Typography variant={"h6"} textAlign={"center"} sx={{ mt: 4 }}>
              {t("seller.verify.term.title")}
            </Typography>
            <Typography variant={"body2"}>
              {t("seller.verify.term.content")}
            </Typography>

            <Typography variant={"body1"} sx={{ mt: 4 }}>
              {t("seller.verify.term.subTitle1")}
            </Typography>
            <Typography variant={"body2"}>
              {t("seller.verify.term.subContent1_1")}
            </Typography>
            <Typography variant={"body2"}>
              {t("seller.verify.term.subContent1_2")}
            </Typography>

            <Typography variant={"body1"} sx={{ mt: 4 }}>
              {t("seller.verify.term.subTitle2")}
            </Typography>
            <Typography variant={"body2"}>
              {t("seller.verify.term.subContent2_1")}
            </Typography>

            <Typography variant={"body1"} sx={{ mt: 4 }}>
              {t("seller.verify.term.subTitle3")}
            </Typography>
            <Typography variant={"body2"}>
              {t("seller.verify.term.subContent3_1")}
            </Typography>

            <Typography variant={"body1"} sx={{ mt: 4 }}>
              {t("seller.verify.term.subTitle4")}
            </Typography>
            <Typography variant={"body2"}>
              {t("seller.verify.term.subContent4_1")}
            </Typography>

            <Typography variant={"body1"} sx={{ mt: 4 }}>
              {t("seller.verify.term.subTitle5")}
            </Typography>
            <Typography variant={"body2"}>
              {t("seller.verify.term.subContent5_1")}
            </Typography>

            <Typography variant={"body1"} sx={{ mt: 4 }}>
              {t("seller.verify.term.subTitle6")}
            </Typography>
            <Typography variant={"body2"}>
              {t("seller.verify.term.subContent6_1")}
            </Typography>

            <Typography variant={"body1"} sx={{ mt: 4 }}>
              {t("seller.verify.term.subTitle7")}
            </Typography>
            <Typography variant={"body2"}>
              {t("seller.verify.term.subContent7_1")}
            </Typography>

            <Typography variant={"body1"} sx={{ mt: 4 }}>
              {t("seller.verify.term.subTitle8")}
            </Typography>
            <Typography variant={"body2"}>
              {t("seller.verify.term.subContent8_1")}
            </Typography>

            <Typography variant={"body1"} sx={{ mt: 4 }}>
              {t("seller.verify.term.subTitle9")}
            </Typography>
            <Typography variant={"body2"}>
              {t("seller.verify.term.subContent9_1")}
            </Typography>

            <Typography variant={"body1"} sx={{ mt: 4 }}>
              {t("seller.verify.term.subTitle10")}
            </Typography>
            <Typography variant={"body2"}>
              {t("seller.verify.term.subContent10_1")}
            </Typography>

            <Typography variant={"body1"} sx={{ mt: 4 }}>
              {t("seller.verify.term.subTitle11")}
            </Typography>
            <Typography variant={"body2"}>
              {t("seller.verify.term.subContent11_1")}
            </Typography>

            <Typography variant={"body1"} sx={{ mt: 4 }}>
              {t("seller.verify.term.subTitle12")}
            </Typography>
            <Typography variant={"body2"}>
              {t("seller.verify.term.subContent12_1")}
            </Typography>

            <Typography variant={"body1"} sx={{ mt: 4 }}>
              {t("seller.verify.term.date")}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Modal>
  );
}
