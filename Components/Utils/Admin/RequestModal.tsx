import * as React from 'react';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { handleCloseModal, modalClose, requestModalClose } from "../../../Store/Modal";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import TextInput from "../../TextInput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Close } from "@mui/icons-material";
import { CircularProgress, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import ContextApi from "../../../Store/context/ContextApi";
import { useTranslation } from "react-i18next";
import { useCreateRequestForSellerVerification } from "../../../hooks/useDataFetch";

interface modal {
    modal: {
        requestModal: boolean
    }
}
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    boxShadow: 24,
    alignItems: 'center',
    borderRadius: 5,
    p: 1,
};
type requestModal = {
    message: string,
    link: string
}
const schema = yup.object().shape({
    message: yup.string().required().min(4)
})
export default function RequestModal() {
  const { t } = useTranslation();
    const { handleSubmit, control, getValues, watch, setValue, reset } = useForm<requestModal>({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            message: ''
        }
    })

    const seller: any = useContext(ContextApi).sellerId;
    const handleUpdateSellerId = useContext(ContextApi).handleUpdateSellerId;
    
    const onSuccess = () => {
        let newSeller = seller;
        newSeller.isActive = false
        handleUpdateSellerId(newSeller)
        handleClose()
        reset();
    }
    
    const { mutate, isLoading } = useCreateRequestForSellerVerification(onSuccess)
    
    const onSubmit: SubmitHandler<requestModal> = async (data) => {

        const newData = {
            ...data,
            sellerId:seller._id
        }
        mutate(newData)
    };
    const dispatch = useDispatch();
    const open: boolean = useSelector((state: modal) => state.modal.requestModal);
    const handleClose = () => dispatch(requestModalClose());
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Container maxWidth={'lg'} component={'main'}>
                <Box sx={style}  >
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 3, mx: 2 }}>
                        <Box display={"flex"} justifyContent={"space-between"}>
                            <Typography fontWeight={500}>Seller Language Preference</Typography>
                            <Close onClick={handleClose} sx={{ cursor: "pointer" }} />
                        </Box>
                        <Box display={"flex"} justifyContent={"space-between"}>
                            <Typography>{t(`language.${seller?.owner?.language}`)}</Typography>
                        </Box>
                        {/*{loginLoading && <Loader/>}*/}
                        <Controller
                            control={control}
                            name='message'
                            render={({ field, formState: { errors } }) => (
                                <TextInput
                                    data={errors?.message} variant={true} multiple={true} field={field} id='Message'
                                />
                            )}
                        />
                        <Stack sx={{ display: 'flex', mt: 2 }}>
                            <Box flexGrow={1} />
                            <Button
                                className={'color'}
                                disabled={isLoading}
                                type="submit"
                                variant="contained"
                                sx={{ alignSelf: 'flex-end' }}
                            >
                                {isLoading && <CircularProgress />}
                                Send
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Container>
        </Modal>
    );
}
