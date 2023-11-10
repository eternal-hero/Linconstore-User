import {Card, CardContent, CardMedia, Rating, Stack, Typography} from "@mui/material";
import React from "react";
import Button from "@mui/material/Button";
interface IsellerCard {
    image: string
}
const SellersCards: React.JSXElementConstructor<IsellerCard> = ({image}) => {
    return (
        <Card elevation={0} className={'product_card'} sx={{border: '2px solid black',  minWidth: { xs: 50, sm: 250},  mt:1, position: 'relative' }}>
            <CardMedia
                component="img"
                alt="store image"
                height="120"

                // className={'product_image'}
                image={image}
            />
            <CardContent sx={{p:0.5, my:0}}>
                <Typography gutterBottom variant="h6" component="div">
                    Store Name
                </Typography>
                <Stack sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Rating name="product_rating" value={4} readOnly />
                    <Button variant={'outlined'} color={'inherit'} sx={{textTransform: 'none'}} size={'small'} className={'colorReversed'} >Remove</Button>
                </Stack>
            </CardContent>
        </Card>
    )

}
export default SellersCards;