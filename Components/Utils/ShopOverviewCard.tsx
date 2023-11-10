import React from "react";
import {Card, Typography, useMediaQuery} from "@mui/material";
import Box from "@mui/material/Box";
import {useSelector} from "react-redux";

interface IShopCard {
    title: string,
    value: number,
    index: number,
    height?: string,
    width?: string,
}
type ICurrency = {
    currency : {
        currency: string
    }
}
const ShopOverviewCard  : React.FC<IShopCard> = ({index, value, title, height, width}) => {
    const isMobile =  useMediaQuery('(max-width: 600px)');
    const currency : string  = useSelector((state: ICurrency) => state.currency.currency);
    return (
                <Card className={'ShopCardOverview'} sx={{display: "flex", alignItems: "center", justifyContent: "center", height, width, p: 2}}>
                    <Box sx={{minWidth:  'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div></div>
                        <Typography my={3} variant={isMobile ? 'subtitle2' : 'h6'} color={index === 1 && "primary"} fontWeight={500}>
                            { index === 1 ? currency : ''} {value}
                        </Typography>

                        <Typography variant={'subtitle2'}>{title}</Typography>
                    </Box>
                </Card>
            )
}
export default ShopOverviewCard;