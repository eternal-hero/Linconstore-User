import React, {useState} from "react";
import {Card, CircularProgress, Typography, useMediaQuery} from "@mui/material";
import Box from "@mui/material/Box";
import {ArrowBack} from "@mui/icons-material";
import {useRouter} from "next/router";
import RatingTable from "../Utils/Admin/RatingTable";
import {useGetUserRatings} from "../../hooks/useDataFetch";
import {useTokenRefetch} from "../../hooks/useRefresh";
import {TProducts, TSellerStore} from "../../Helpers/Types";
type TRating = {
    name : string,
    rate : number,
    description : string,
    productId: TProducts
    owner : TSellerStore
}
const Ratings : React.FC = () => {
    const isMobile = useMediaQuery('(max-width: 600px)');
    const  router = useRouter();
    const [ratings, setRatings] = useState<TRating[]>([]);

    const onSuccess = (data : TRating[]) => {
        setRatings(data)
    }
    const {isLoading, isFetched, refetch} = useGetUserRatings(onSuccess)
    useTokenRefetch(refetch)
    return (
        <Card elevation={0} sx={{ background:'white', mt:1, p:2, minHeight: '90vh'}}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}
            >
                {isMobile && <ArrowBack  onClick={() => router.back()} className={'pointer'}/> }
            </Box>
            {isLoading && <Typography variant={'h6'} textAlign={"center"}>  <CircularProgress/></Typography>}
            {isFetched && ratings.length === 0 && <Typography variant={'h6'} textAlign={"center"}>  Such Empty!</Typography>}
            <Box>
                {isFetched && ratings.length > 0 && <RatingTable  ratings={ratings}/>}
            </Box>
        </Card>
    )
}
export default Ratings;