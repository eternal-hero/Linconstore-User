import {Alert, Snackbar, useMediaQuery} from '@mui/material';
import { opendir } from 'fs';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {snackbarEnd} from "../../Store/Utils";
import { useTranslation } from "react-i18next";
interface rootState {
    util : {
        message: string,
        snackbarOpen: boolean,
        severity: string,
    }
}
const Notify = () => {
    const {t} = useTranslation();
    const open  = useSelector((state: rootState ) => state.util.snackbarOpen);
    const message = useSelector((state: rootState) => state.util.message);
    const severity = useSelector((state: rootState) => state.util.severity);
    const dispatch = useDispatch();
    const handleClose = (event:React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(snackbarEnd())
    }
    const isMobile : boolean = useMediaQuery(('(max-width: 600px)'));

    return (

        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal:  'right'
            }}
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
            sx={{mb: isMobile ? 10 :  0}}
        >
            <Alert variant='filled' elevation={4} onClose={handleClose} severity={severity=== 'success' ? 'success' : 'error'} sx={{ width: '100%' }}>
                {t(message)}
            </Alert>
        </Snackbar>
    )
}

export default Notify