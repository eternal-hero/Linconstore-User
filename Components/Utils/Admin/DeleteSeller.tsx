import * as React from 'react';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import {deleteModalClose, updateModal} from "../../../Store/Modal";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import {CircularProgress, Typography} from "@mui/material";
import {useDeleteAdminSeller} from "../../../hooks/useDataFetch";
interface modal {
    modal : {
        deleteModal : boolean,
        type: boolean,
        productId: string
    }
}
const style  = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    // border: '2px solid #000',
    boxShadow: 24,
    display: 'flex',
    bgcolor: '#000',
    color: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    height: 200,
    maxHeight: 300,
    borderRadius: 5,
    p: 1,
};


export default function DeleteSeller() {

    const dispatch = useDispatch();
    const open : boolean = useSelector((state: modal) => state.modal.deleteModal);
    const productId : string = useSelector((state: modal) => state.modal.productId);

    const handleClose = () => dispatch(deleteModalClose());

    const onSuccess = () => {
        dispatch(updateModal())
        handleClose()
    }
    const handleDelete = () => {
        const data = {
            id: productId
        }
        deleteAdmin(data)
    }
    const {mutate: deleteAdmin, isLoading} = useDeleteAdminSeller(onSuccess)

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Container maxWidth={'lg'} component={'main'}>
                <Box sx={style}  >
                    <Typography variant={'h6'} sx={{mt:4}}>
                        Are you sure you want to delete account?
                    </Typography>
                    <Box sx={{mt:5, display: 'flex',  flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Button variant='contained'
                                sx={{borderRadius: '25px'}}    color='inherit' onClick={handleClose} >
                            Cancel
                        </Button>
                        <Box sx={{mx:4}}/>
                        <Button variant='contained'
                                sx={{borderRadius: '25px'}} disabled={isLoading}   color='error' onClick={handleDelete} >
                            {isLoading  && <CircularProgress/>} delete
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Modal>
    );
}
