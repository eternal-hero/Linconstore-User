import Head from "next/head";
import React, { useState } from "react";
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { ArrowBack, Message } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useGetSellerRefunds, useSellerUpdateRefund } from "../../hooks/useDataFetch";
import { useTranslation } from "react-i18next";
import { useTokenRefetch } from "../../hooks/useRefresh";
import Image from "next/image";

type TProduct = {
  title: string;
};
interface IRefund {
  reason: string;
  productId: TProduct;
  status: string;
}
const Refund: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const [refunds, setRefund] = useState<IRefund[]>([]);
  const onSuccess = (data: IRefund[]) => {
    setRefund(data);
  };
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const { isLoading, isFetched, refetch } = useGetSellerRefunds(onSuccess);
  useTokenRefetch(refetch)
  const { t } = useTranslation();

  const gotoConversation = (refund: any) => {
    if (refund.status == "pending" || refund.status == "active") {
      const productDetail = {
        buyerInfo: refund.userId,
        id: refund.productId._id,
      };
      const roomName = `refund:${refund.productId.owner?.owner?._id}:${refund._id}`;
      localStorage.setItem("currentChatRoomName", roomName);
      localStorage.setItem("product_detail", JSON.stringify(productDetail));
      if (refund.status != "active") {
        updateRefund({ id: refund._id, status: "active" })
      } else {
        router.push("/seller/chat");
      }
    }
  };

  const handleInitiatedRefund = (refund: any) => {
    if (refund.status == "active") {
      updateInitRefund({ id: refund._id, status: "RF-initiated" })
    }
  };

  const onRefundSuccess = () => {
    router.push("/seller/chat");
  }
  const onRefundInitSuccess = () => {
    refetch()
  }


  const handleChange = (panel: string) => (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false);
  };
  const { isLoading: isUpdating, mutate: updateRefund } = useSellerUpdateRefund(onRefundSuccess)
  const { isLoading: isInitUpdating, mutate: updateInitRefund } = useSellerUpdateRefund(onRefundInitSuccess)

  return (
    <>
      <Head>
        <title>{t("pagetitle.Refund")}</title>
        <meta name={"Refund Request"} content={"These are Refund Request"} />
        <link rel="icon" href="/favicon-store.ico" />
      </Head>
      <Card elevation={0} sx={{ bgcolor: "transparent", mt: 1, p: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {isMobile && (
            <ArrowBack onClick={() => router.back()} className={"pointer"} />
          )}
        </Box>
        {refunds.length === 0 && (
          <Typography variant={"body1"}>{t("seller.refund.no_msg")}</Typography>
        )}
        {refunds.length > 0 && (
          <>
            {refunds.map((refund, index) => (
              <>
                <Accordion
                  expanded={expanded === `'panel'${index}`}
                  onChange={handleChange(`'panel'${index}`)}
                  key={index}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"

                  >
                    {isMobile && <div style={{ display: "flex", flexDirection: "column" }}>
                      <Typography sx={{ width: "100%", flexShrink: 0, fontSize: "14px", mb: isMobile ? 1 : "" }}>
                        {refund.productId?.title}
                      </Typography>

                      <Typography sx={{ color: "text.secondary", fontSize: "14px" }}>

                        {refund.reason}
                      </Typography>

                    </div>}
                    {!isMobile && <>
                      <Typography sx={{ width: "65%", flexShrink: 0, fontSize: "14px" }}>
                        {refund.productId?.title}
                      </Typography>

                      <Typography sx={{ color: "text.secondary", fontSize: "14px" }}>

                        {refund.reason}
                      </Typography>

                    </>

                    }


                  </AccordionSummary>
                  <AccordionDetails sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ paddingLeft: '10px' }}>
                      <Typography>
                        {t("seller.refund.reply")} : <Button onClick={() => gotoConversation(refund)} disabled={refund.status !== "pending" && refund.status !== "active"}>
                          <Message sx={{ color: "#25d3cc", fontSize: !isMobile ? "24px" : "18px" }} />
                        </Button>
                      </Typography>
                    </Box>
                    <Box sx={{ paddingRight: '25px' }}>
                      <Button
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onClick={() => handleInitiatedRefund(refund)}
                        disabled={refund.status !== "active"}
                      >
                        <Typography fontSize={!isMobile ? "18px" : "14px"} textAlign={"center"} mr={1}>
                          {t("seller.refund.issue")}
                        </Typography>
                        <Image
                          width={!isMobile ? 35 : 25}
                          height={!isMobile ? 27 : 20}
                          style={{
                            marginTop: 30,
                            width: "100%",
                            height: "100%",
                          }}
                          placeholder="blur"
                          blurDataURL={
                            "https://via.placeholder.com/300.png/09f/fff"
                          }
                          src={"https://res.cloudinary.com/linconstore-cloud/image/upload/f_auto,q_auto/v1/web-asset/l5lbd4mogas0jluoidkz"}
                          alt={"refund img"}
                        />
                      </Button>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </>
            ))}
          </>
        )}
      </Card >
    </>
  );
};
export default Refund;
