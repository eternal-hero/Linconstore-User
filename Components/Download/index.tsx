import { Box, useMediaQuery, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Image from "next/image";
import React from 'react';
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { getCurrencySymbol } from "../../Helpers/Exchange";
import { getCurrDate } from "../../Helpers/getDate";

interface DownloadOrdersProps {
  orders: any;
}

const Download = ({ orders }: DownloadOrdersProps) => {
  const { t } = useTranslation();
  const userString = Cookies.get("userInfo");
  const isMobile = useMediaQuery("(max-width: 600px)");
  let userInfo: any = {}
  if (userString) {
    userInfo = JSON.parse(userString);
  }

  return (
    <Box sx={{ my: 5 }}>
      <Box display={"flex"} justifyContent={"space-between"} alignItems={'center'} mb={2}>
        <Box display={'flex'} gap={2} alignItems={'center'}>
          <Image
            width={isMobile ? 20 : 100}
            height={isMobile ? 20 : 100}
            style={{ marginTop: isMobile ? 10 : 30, width: "100%", height: "100%" }}
            placeholder="blur"
            blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
            src={"https://res.cloudinary.com/linconstore-cloud/image/upload/f_auto,q_auto/v1/web-asset/tf1popixtcdbhxonib7b"}
            alt={"linconstore logo"}
          />
          <Typography fontSize={"16px"} fontWeight={500}>{t("seller.download.My_Product")}</Typography>
        </Box>
        <Typography fontWeight={500} fontSize={isMobile ? 8 : 24}>
          {getCurrDate()}
        </Typography>
      </Box>


      <TableContainer component={Paper} sx={{ maxHeight: "calc(100% - 200px)", boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)", background: "#fff" }} >
        <Table stickyHeader size={"small"}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography fontSize={15}>{t("seller.download.Image")}</Typography>
              </TableCell>
              <TableCell>
                <Typography fontSize={isMobile ? 8 : 20}>{t("seller.download.Product_Name")}</Typography>
              </TableCell>
              <TableCell>
                <Typography fontSize={isMobile ? 8 : 20}>{t("seller.download.Category")}</Typography>
              </TableCell>
              <TableCell>
                <Typography fontSize={isMobile ? 8 : 20}>{t("seller.download.Stock")}</Typography>
              </TableCell>
              <TableCell>
                <Typography fontSize={15}>{t("seller.download.Status")}</Typography>
              </TableCell>
              <TableCell>
                <Typography fontSize={15}>{t("seller.download.Price")}</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((row: any, index: number) => (
              <TableRow key={index} sx={{ background: "#fff" }} >
                <TableCell sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Image
                    width={isMobile ? 20 : 100}
                    height={isMobile ? 20 : 100}
                    style={{ marginTop: isMobile ? 10 : 30, width: "100%", height: "100%" }}
                    placeholder="blur"
                    blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
                    src={row.photo[0]}
                    alt={"product image"}
                  />
                </TableCell>
                <TableCell>
                  <Typography fontSize={isMobile ? 7 : 20} >{row.title}</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontSize={isMobile ? 7 : 20} >{t(`maincategory.${row.category.title}`)}</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontSize={isMobile ? 7 : 20} >{row.quantity}</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontSize={isMobile ? 7 : 20} >{row.active && row.quantity > 0 ? "Active" : "Inactive"}</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontSize={isMobile ? 7 : 20} >{getCurrencySymbol(userInfo?.currency)} {row.price}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default Download