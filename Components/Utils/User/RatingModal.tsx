import * as React from 'react';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import {
    addRatingModalClose,
} from "../../../Store/Modal";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import Button from "@mui/material/Button";
import TextInput from "../../TextInput";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {CircularProgress, FormHelperText, Rating, Stack} from "@mui/material";
import {useRateProduct} from "../../../hooks/useDataFetch";
import {useContext, useEffect, useState} from "react";
import ContextApi from "../../../Store/context/ContextApi";
import {useRouter} from "next/router";
interface modal {
    modal : {
        addRatingModal : boolean
    }
}
const style  = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    boxShadow: 24,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: 'auto',
    borderRadius: 5,
    p: 1,
};
const schema = yup.object().shape({
    rating: yup.number().typeError('Must be a number').required(),
    comment: yup.string().required().min(8),
})
type addRating = {
    rating: number,
    comment: string,
}
export default function RatingModal() {
    const {  handleSubmit, control, getValues, reset,watch, formState : {errors} } = useForm<addRating>({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            rating: 1,
            comment: '',
        }
    })
    const ratingId = useContext(ContextApi).ratingId;
    const clearRate = useContext(ContextApi).clearRatingId;
    const onSubmit: SubmitHandler<addRating> = async (data) => {
        const {comment, rating} = data
        const submitData = {
            comment,
            rating,
            productId : ratingId
        }
        rateProduct(submitData)
    };
    const router = useRouter()
    const onSuccess = () => {
        reset();
        clearRate()
        handleClose();
        router.push("/account/pastorders");
    }
    const {isLoading,mutate: rateProduct, isError, error}  = useRateProduct(onSuccess)
    const dispatch = useDispatch();
    const open : boolean = useSelector((state: modal) => state.modal.addRatingModal);
    const handleClose = () => dispatch(addRatingModalClose());
    const [errorMessage, setErrorMessage] = useState('');
    useEffect(() =>  {
        if (error instanceof Error){
            //  @ts-ignore
            setErrorMessage(error?.response?.data?.status);
        }
    },[isError])
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
                        <Controller
                            name='comment'
                            control={control}
                            render={({field, formState: {errors}}) => (
                                <TextInput
                                    data={errors?.comment} field={field} id='Comment' multiple={true}
                                />
                            )
                            }
                        />
                        <Controller
                            name='rating'
                            control={control}
                            render={({field}) => (
                                <Rating
                                    {...field}
                                />
                            )
                            }
                        />
                        {errors && <FormHelperText sx={{color: 'red'}}> {errors?.rating?.message} </FormHelperText>}
                        <Stack sx={{display: 'flex', mt:2}}>
                            <Box flexGrow={1}/>
                            {isError && errorMessage}
                            <Button
                                className={'color'}
                                // disabled={isLoading}
                                type="submit"
                                variant="contained"
                                sx={{alignSelf: 'flex-end'}}
                            >
                                {isLoading && <CircularProgress/>}
                                Save
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Container>
        </Modal>
    );
}
