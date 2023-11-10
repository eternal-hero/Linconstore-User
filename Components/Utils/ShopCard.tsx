import React from "react";
import { Card, Stack, Typography, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import ChartBar from "./Chart";
import { getCurrentDate } from "../../Helpers/getDate";
import { useSelector } from "react-redux";

interface IShopCart {
    chart: number[]
}
type TCurrency = {
    currency: string
}

interface ICurrency {
    currency: TCurrency
}
const ShopCard: React.FC<IShopCart> = ({ chart }) => {
    const currency: string = useSelector((state: ICurrency) => state.currency.currency);

    return (
        <Card elevation={3} sx={{ p: 3, boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)" }} className={'chart'} >
            <Box >
                <Typography variant={'body2'}> {currency}</Typography>
                <Typography textAlign={'center'} variant={'subtitle2'}> {getCurrentDate(0)} - {getCurrentDate(6)}
                </Typography>
                <ChartBar chart={chart} />
            </Box>
        </Card>
    )
}
export default ShopCard;