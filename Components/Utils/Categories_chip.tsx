import React from "react";
import Grid from "@mui/material/Grid";
import {Chip} from "@mui/material";
import Avatar from "@mui/material/Avatar";
interface Icat {
    cat: string
}
const Categories_chip : React.JSXElementConstructor<Icat> = ({cat}) => {

    return (
                 <Grid item xs={4} md={2}  >
                <Chip
                    className="buttonClass"
                    avatar={<Avatar alt={cat}>{cat.split('')[0]}</Avatar>}
                    label={cat}
                    variant="outlined"
                />
            </Grid>
    )
}
export default Categories_chip;