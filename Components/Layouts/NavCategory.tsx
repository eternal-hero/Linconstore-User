import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {categoryOptions} from "../Seller/StoreInfo";
import Typography from "@mui/material/Typography";
import {ArrowDropDown} from "@mui/icons-material";
import {Stack} from "@mui/material";

export default function NavCategory() {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const [isClicked, setIsClicked]  = React.useState<boolean>(false);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLElement>,
        index: number,
    ) => {
        setSelectedIndex(index);
        setIsClicked(true);
        setAnchorEl(null);
    };

    return (
        <div className={'navDiv'}>
            <Button
                size={'small'}
                id="positioned-button"
                aria-controls={open ? 'demo-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={{color: '#fff'}}
            >
                <Stack direction={'row'} sx={{mt:0.5, pb:2}} >
                    <Typography variant={'body1'} >    {!isClicked ? 'All Categories' : categoryOptions[selectedIndex]}
                    </Typography>
                    <ArrowDropDown sx={{mb:1, pb:0}}/>
                </Stack>
            </Button>
            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                {categoryOptions.map((cat, index) => {
                    return <MenuItem
                        key={index}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}>{cat}</MenuItem>})}
            </Menu>
        </div>
    );
}
