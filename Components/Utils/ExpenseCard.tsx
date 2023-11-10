import React, {useCallback} from "react";
import {Card, Typography, useMediaQuery} from "@mui/material";
import Box from "@mui/material/Box";
import {increment} from "../../Store/Stepper";
import {useDispatch} from "react-redux";

interface Idata {
    icon: any,
    title: string,
    index: number,
}

const ExpenseCard : React.FC<Idata> = ({icon, title, index}) => {
    const isMobile : boolean = useMediaQuery('(max-width: 904px)');
    const dispatch = useDispatch()
    const handleClick = useCallback(() => {
        if (title === 'Card') {
            return dispatch(increment(1))
        }
        if (title === 'Transfer') {
            dispatch(increment(2))
        }
    },[title])
        return  (
                <Card  onClick={handleClick}  sx={{border: '2px solid black', color: 'black', p:1}}>
                    <Box className={'pointer'} sx={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                        {icon}
                        <Typography gutterBottom={index === 2 } textAlign={'center'} variant={isMobile ?  'subtitle2' : 'h6' }>
                            {title}
                        </Typography>
                    </Box>

                </Card>

            )
}
export default ExpenseCard;