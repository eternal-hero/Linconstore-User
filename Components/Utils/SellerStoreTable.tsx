import React, {useState} from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Image from "next/image";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import {number} from "card-validator";
import {useSelector} from "react-redux";

type TCategory = {
  title: string;
};
type TProduct = {
  title: string;
  photo: string[];
  subcategory: string,
  category: TCategory;
  view: number;
};
interface IOrder {
  amount: number,
  quantity: number,
  name: string,
  productId: TProduct
}
interface ISellerStoreTable {
  products: IOrder[];
  title: string;
}
type Iutil = {
  util: {
    sellerRate: number;
  };
};
type ICurrency = {
  currency : {
    currency: string
  }
}
const SellerStoreTable: React.FC<ISellerStoreTable> = ({ products, title }) => {
  const { t } = useTranslation();
  const rateDispatch: number = useSelector(
      (state: Iutil) => state.util.sellerRate
  );
  const currency : string  = useSelector((state: ICurrency) => state.currency.currency);

  const [rate, setRate] = useState<number>(rateDispatch);
  return (
    <>
      <Typography variant={"h6"} my={2}>
        {title}
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 350 }} size={"small"} aria-label="stats table">
          <TableHead>
            <TableRow>
              <TableCell>{t("seller.store_stats.data_field.photos")}</TableCell>
              <TableCell align="left">
                {t("seller.store_stats.data_field.name")}
              </TableCell>
              <TableCell align="left">
                {t("seller.store_stats.data_field.category")}
              </TableCell>
              <TableCell align="left">
                {t("seller.store_stats.data_field.unit")}
              </TableCell>
              {title === t("seller.store_stats.top_product") ? (
                ""
              ) : (
                <TableCell align="left">
                  {t("seller.store_stats.data_field.amount")}
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map(({ name, amount, quantity, productId }, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Image
                    src={productId.photo[0]}
                    width={"63px"}
                    height={"46px"}
                    placeholder={"blur"}
                    blurDataURL={
                      "https://cdn.pixabay.com/photo/2017/02/12/17/17/music-2060616_960_720.jpg"
                    }
                    alt={"image of table"}
                  />
                </TableCell>
                <TableCell align="left">{name}</TableCell>
                <TableCell align="left">{productId.subcategory}</TableCell>
                <TableCell align="left">{  quantity}</TableCell>

                <TableCell align="left" sx={{color: "#00a866"}}>{currency} { Number(rate *  amount).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
export default SellerStoreTable;
