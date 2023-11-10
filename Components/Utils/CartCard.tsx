import React from "react";
import {Card} from "@mui/material";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import {useRouter} from "next/router";
import slug from "slug";
interface Icat {
    category: string,
    link: string,
    index: number,
    id: string
}
//a function that generates random color hex values//
const getRandomColor   = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const CatCard : React.JSXElementConstructor<Icat> = ({category, id, link, index}) => {
    const router = useRouter();
    const color : string [] = ['primary',  'secondary', 'error', 'warning','info', 'success'];
    // @ts-ignore
    const length = category.length

    return (
            <Card onClick={() => router.push("/category/[slug]", `/category/${slug(category)}-${id}`)} className={'catCard'} style={{background: `url(${link})`}} sx={{minWidth: {xs: '200px', sm: '250px', md: '280px', lg :'320px', xl: '400px'}}}>
                <Box sx={{ p:2, display: 'flex', width:'100%',  justifyContent:'left', alignItems: 'left' }}>
                        {/*<Stack direction={'row'} sx={{p:0.5}} spacing={0.5} >*/}
                            <Badge className={'topCat'} badgeContent={category} sx={{minWidth: '100px',width: length > 13 ? '120px' : '100px'}} color={'primary'}/>
                        {/*</Stack>*/}
                </Box>
            </Card>
            )

}
export default CatCard;