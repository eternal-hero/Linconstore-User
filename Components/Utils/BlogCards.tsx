import {Card, Stack, Typography, useMediaQuery} from "@mui/material";
import React from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import {useRouter} from "next/router";
import {Visibility} from "@mui/icons-material";



const BlogCard : React.JSXElementConstructor<any> = () => {
    const router = useRouter();
    const isMobile = useMediaQuery('(max-width:1200px)')
    return (
        <Card className={'category'} variant={'outlined'} onClick={() => router.push('/product')} sx={{border: 'none', minWidth:'100px', position: 'relative', bgcolor: 'transparent'}}>
            <Box sx={{display: 'flex', mx:isMobile ? 0 : 2, flexDirection: 'column',p:1 }}>
                <Image
                    height={200}
                    style={{borderRadius: '7px'}}
                    width={120}
                    placeholder={'blur'}
                    blurDataURL={'https://via.placeholder.com/300.png/09f/fff'}
                    src={'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=403&h=380'}
                    alt={"Image of blog"}
                />
                <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Stack>
                        <Typography variant={'subtitle2'}> 15th june 2022  </Typography>
                        <Typography variant={'body1'}>We launched our marketplace</Typography>
                    </Stack>
                    <Stack direction={'row'} spacing={1}>
                        <Typography variant={'body1'}>100</Typography>
                        <Visibility/>
                    </Stack>
                </Box>
            </Box>
        </Card>

    )

}
export default BlogCard;