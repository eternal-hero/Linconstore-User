import * as React from 'react';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {value} from "dom7";

function Progress(props: LinearProgressProps & { value: number }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress color={'success'} variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}
interface ISeller {
    value: number
}
const SellersReputation : React.FC<ISeller>  = ({value}) => {
    const [progress, setProgress] = React.useState(value);
    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= Math.round(99) ? 99 : prevProgress + 10));
        }, 800);
        return () => {
            clearInterval(timer);
        };
    }, [value]);

    return (
        <Box sx={{ width: '100%' }}>
            <Progress value={progress} />
        </Box>
    );
}
export default SellersReputation;