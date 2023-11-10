import React from "react";
import {Card, Stack, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import {numberWithCommas} from "../../../Helpers/utils";
import {ArrowDownwardOutlined, ArrowUpwardOutlined} from "@mui/icons-material";
interface IStats {
    title: string,
    amount: number,
    percent: number,
    color: string
}
const Stats : React.FC<IStats> = ({amount, percent, title, color}) => {
    return (
        <Card sx={{bgcolor: 'white', borderRadius: '7px', height: "100%", display: "flex", alignItems: "center"}}>
            <Box sx={{display: 'flex', flexDirection: 'column', p:2, justifyContent: 'space-between', width: "100%"}}>
                <Typography fontSize={14}> {title}</Typography>
                <Typography fontSize={14} textAlign={'center'}> {title === 'Visitors' ? 'Nan' : numberWithCommas(amount)}</Typography>
              <Stack direction={'row'} spacing={1} sx={{mx:2}}>
                  <Typography fontSize={14} >  { title === 'Visitors' ? '' :  parseInt(String(percent)) +  '%'}</Typography>
                  {color === 'red' ?  <ArrowDownwardOutlined sx={{color}}/>  : <ArrowUpwardOutlined  sx={{color}}/>}
                  <Typography fontSize={14}>Last week</Typography>
              </Stack>
            </Box>
        </Card>
    )
}
export default Stats;