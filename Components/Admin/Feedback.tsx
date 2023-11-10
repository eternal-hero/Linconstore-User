import React, {useState, useCallback} from "react";
import {Card, CircularProgress, Grid, Typography, useMediaQuery} from "@mui/material";
import Box from "@mui/material/Box";
import {ArrowBack} from "@mui/icons-material";
import {useRouter} from "next/router";
import FeedbackCards from "../Utils/Admin/FeedbackCards";
import {useFetchFeedbacks} from "../../hooks/useDataFetch";
import {useTokenRefetch} from "../../hooks/useRefresh";

const Feedback : React.FC = () => {
    const isMobile = useMediaQuery('(max-width: 600px)');
    const  router = useRouter();

    const [feedBacks, setFeedBacks] = useState<any[]>([]);
    const onSuccess = (data : any[]) => {
        setFeedBacks(data)
    }
    const {isLoading, refetch} = useFetchFeedbacks(onSuccess)
    useTokenRefetch(refetch)
    
    const handleRefetch = useCallback(() => {
        refetch();
    }, []);

    return (
        <Card elevation={0} sx={{ background:'transparent', mt:1, p:2, minHeight: '90vh'}}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}
            >
                {isMobile && <ArrowBack  onClick={() => router.back()} className={'pointer'}/> }
            </Box>
            <Typography variant={'h6'} textAlign={"center"}>{isLoading && <CircularProgress/>}</Typography>
            <Box sx={{my:1}}>
                    <Grid container spacing={2}>
                        {feedBacks.map((feedBack, index) => (
                            <Grid key={index} item xs={12} sm={6} md={4}>
                                <FeedbackCards feedBack={feedBack} handleRefetch={handleRefetch}/>
                            </Grid>
                        ))}
                    </Grid>
            </Box>
        </Card>
    )


}
export default Feedback;