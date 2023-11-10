import * as React from 'react';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import {handleCloseModal, modalClose, requestModalClose} from "../../../Store/Modal";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import Button from "@mui/material/Button";
import TextInput from "../../TextInput";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {CircularProgress, FormControl, FormHelperText, InputLabel, Select, Stack, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
import {closeModal, updatePayout} from "../../../Store/Payout";
import MenuItem from "@mui/material/MenuItem";
import {snackBarOpen} from "../../../Store/Utils";
import {useUpdatePayout} from "../../../hooks/useDataFetch";
import {useEffect, useState} from "react";
interface modal {
    payout : {
        open : boolean
    }
}
const style  = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    boxShadow: 24,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: 300,
    maxHeight: 360,
    borderRadius: 5,
    p: 1,
};
type payoutModal = {
    type : string,
    balance : number
}
interface IPayout {
    payout: {
        storeId: string
    }
}
const schema = yup.object().shape({
    type: yup.string().required(),
    balance: yup.number().typeError('Must be a number').min(1, 'Must be greater than 0'),
})
export default function PayoutModal() {
    const {  handleSubmit, control, getValues,watch, setValue, reset, formState: {errors} } = useForm<payoutModal>({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            balance: 0,
            type: '',
        }
    })
    const payoutSuccess = () => {
        reset()
        dispatch(updatePayout())
        handleClose();
        dispatch(snackBarOpen({message: 'Updated successfully', snackbarOpen: true, rate: 0,sellerRate: 0, severity: 'success'}))
    }
    const storeId = useSelector((state : IPayout) => state.payout.storeId);

    const [errorMessage, setErrorMessage] = useState<string>('');
    const onSubmit: SubmitHandler<payoutModal> = async (data) => {
        const {type, balance: amount} = data;
        const newData = {
            type,
            amount,
            storeId
        }
        updatePayoutHandler(newData)
    };
    const {mutate: updatePayoutHandler, isLoading, isError, error} = useUpdatePayout(payoutSuccess)
    useEffect(() => {
        // @ts-ignore
        setErrorMessage(error?.response?.data?.message as string)
    }, [isError])
    const dispatch = useDispatch();
    const open : boolean = useSelector((state: modal) => state.payout.open);
    const handleClose = () => {
        reset()
        dispatch(closeModal());
    }
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Container maxWidth={'lg'} component={'main'}>
                <Box sx={style}  >
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 3, mx:2 }}>
                        {/*{loginLoading && <Loader/>}*/}
                        <Stack spacing={4} direction={'row'}>
                            <Typography variant={'h5'}> Update Store</Typography>
                            <FormControl sx={{minWidth: 170}}  >
                                <InputLabel  id="demo-simple-select-label"  shrink={false}>
                                    {watch('type') === ''  &&    'Select'}</InputLabel>
                                <Controller
                                    name='type'
                                    control={control}
                                    render={({field, formState: {errors}}) => (
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            {...field}
                                            variant={'outlined'}
                                            className={'sortButton'} sx={{bgcolor: '#fff', height:45, color: '#000', border: '2px solid black',
                                            "& .MuiSvgIcon-root": {
                                                color: "black",
                                            }
                                        }}
                                        >
                                            <MenuItem value={"Refund Request "}>Refund Request </MenuItem>
                                            <MenuItem value={'Seller Payout  Updated'}>Seller Payout  Updated</MenuItem>
                                        </Select>
                                    )
                                    }
                                />

                                <FormHelperText sx={{color: 'red'}}>{errors?.type?.message} </FormHelperText>
                            </FormControl>
                        </Stack>


                        <Controller
                            control={control}
                            name='balance'
                            render={({ field, formState: {errors} }) => (
                                <TextInput
                                    data={errors?.balance} variant={true} field={field} id='Balance' type={'number'}
                                />
                            )}
                        />
                        <Stack sx={{display: 'flex', mt:2}}>
                            <Box flexGrow={1}/>
                            <Button
                                className={'color'}
                                disabled={isLoading}
                                type="submit"
                                variant="contained"
                                sx={{alignSelf: 'flex-end'}}
                            >
                                {isLoading && <CircularProgress/>}
                                Send
                            </Button>
                            {isError && <FormHelperText sx={{color:'red' }}> {errorMessage}</FormHelperText>  }
                        </Stack>
                    </Box>
                </Box>
            </Container>
        </Modal>
    );
}
