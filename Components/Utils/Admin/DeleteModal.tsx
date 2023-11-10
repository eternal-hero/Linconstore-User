import React, { useState } from "react";
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { deleteModalClose, updateModal } from "../../../Store/Modal";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Cookies from "js-cookie";

import { Stack, TextField, Typography } from "@mui/material";
import { useDeleteAdmin, useDeleteStoreId } from "../../../hooks/useDataFetch";
import { Close } from '@mui/icons-material';
interface modal {
    modal: {
        deleteModal: boolean,
        productId: any,
        type: boolean
    }
}
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    // border: '2px solid #000',
    boxShadow: 24,
    display: 'flex',
    bgcolor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 5,
    p: 1,
};

export default function DeleteModal() {

    const dispatch = useDispatch();
    const open: boolean = useSelector((state: modal) => state.modal.deleteModal);
    const selected = useSelector((state: modal) => state.modal.productId);
    const type: boolean = useSelector((state: modal) => state.modal.type);
    const [verifyCode, setVerifyCode] = useState("");

    const handleClose = () => dispatch(deleteModalClose());

    const onSuccess = () => {
        dispatch(updateModal())
        handleClose()
    }
    const handleDelete = () => {
        if (type) {
            const data = {
                id: selected?._id,
            }
            deleteSeller(data)
        } else {
            const adminInfo = JSON.parse(Cookies.get("adminInfo"));
            const data = {
                selectedId: selected?._id,
                verifyCode: verifyCode,
                id: adminInfo._id
            }
            deleteAdmin(data)
        }
    }
    const { isLoading, mutate: deleteAdmin } = useDeleteAdmin(onSuccess);
    const { isLoading: isDeleting, mutate: deleteSeller } = useDeleteStoreId(onSuccess)
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Container maxWidth={'lg'} component={'main'}>
                <Box sx={style}>
                    <Box
                        component="form"
                        // onSubmit={handleSubmit(onSubmit)}
                        noValidate
                        sx={{ my: 3, mx: 2 }}
                    >
                        <Stack spacing={2}>
                            <Box display={"flex"} justifyContent={"space-between"}>
                                <Typography fontWeight={600}>Delete Admin</Typography>
                                <Close onClick={handleClose} sx={{ cursor: "pointer" }} />
                            </Box>

                            <Stack px={4} gap={1}>
                                <Typography>
                                    To delete the admin below enter the verification code sent to main admin
                                </Typography>
                                {
                                    type ?
                                        <>
                                            <Stack direction={"row"} justifyContent={"space-between"}>
                                                <Typography>{selected?.name}</Typography>
                                                <Typography>{selected?.owner.owner.country}</Typography>
                                            </Stack>
                                            <Typography>{selected?.owner.owner.email}</Typography>
                                            <Stack textAlign={"center"}>
                                                <Button size='small' variant='contained' color='error' onClick={handleDelete}>
                                                    Delete
                                                </Button>
                                            </Stack>
                                        </> :
                                        <>
                                            <Stack direction={"row"} justifyContent={"space-between"}>
                                                <Typography>{selected?.username}</Typography>
                                            </Stack>
                                            <Typography>{selected?.email}</Typography>
                                            <Stack textAlign={"center"}>
                                                <Typography>Enter Verification Code</Typography>
                                                <Stack direction={"row"} gap={1}>
                                                    <TextField size='small' fullWidth
                                                        onChange={(e) => setVerifyCode(e.target.value)}
                                                        value={verifyCode} />
                                                    <Button size='small' variant='contained' color='error'
                                                        disabled={!verifyCode} onClick={handleDelete}
                                                    >
                                                        Delete
                                                    </Button>
                                                </Stack>
                                            </Stack>
                                        </>
                                }

                            </Stack>
                        </Stack>
                    </Box>
                </Box>
            </Container>
        </Modal>
    );
}
