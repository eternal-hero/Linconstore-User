import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import TextInput from "../TextInput";
import Button from "@mui/material/Button";
import {FormHelperText, Grid, Stack} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {CountryDropdown} from "react-country-region-selector";
import {useDispatch} from "react-redux";
import {decrement, increment} from "../../Store/Stepper";
import {ArrowBack} from "@mui/icons-material";
type Itransfer = {
    account: number,
    swift: number,
    amount: number,
    country: string
}
const schema = yup.object().shape({
    account: yup.number().typeError('Must be a number').required().min(1),
    swift: yup.number().typeError('Must be a number').required().min(1),
    amount: yup.number().typeError('Must be a number').required().min(1),
    country: yup.string().required().min(1),
})
const Transfer : React.FC = () => {
    const {  handleSubmit, control, getValues, reset, formState: {errors} } = useForm<Itransfer>({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            account: 0,
            country: '',
            swift: 0,
            amount: 0
        }
    })
    const onSubmit: SubmitHandler<Itransfer> = (data) => {
        reset()
    }
    const dispatch = useDispatch();
    return (
        <>
        <ArrowBack onClick={() => dispatch(decrement(2))} className={'pointer'}/>
        <Box sx={{p:2, border : '2px solid black'}}>
            <Stack sx={{borderBottom: '1px solid black'}}>
                <Typography variant={'h6'}>Account Details </Typography>
            </Stack>
        <Grid  container >
            <Grid item xs={12} sm={4}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
            <Controller
                control={control}
                name='country'
                render={({ field  }) => (
                    <CountryDropdown
                        id={'country'}
                        {...field} />
                )}
            />
            {errors.country && (
                <FormHelperText sx={{color: '#d32f2f'}}> {errors?.country?.message}</FormHelperText>
            )}
            <Controller
                name='account'
                control={control}
                render={({field, formState: {errors}}) => (
                    <TextInput
                        data={errors?.account} field={field} id='Account No' type={'number'}
                    />
                )
                }
            />
            <Controller
                name='swift'
                control={control}
                render={({field, formState: {errors}}) => (
                    <TextInput
                        data={errors?.swift} field={field} id='Swift code' type={'number'}
                    />
                )
                }
            />
            <Typography variant={'body1'}> Available : $10,000</Typography>
            <Controller
                name='amount'
                control={control}
                render={({field, formState: {errors}}) => (
                    <TextInput
                        data={errors?.swift} field={field} id='amount' type={'number'}
                    />
                )
                }
            />
            <Button variant={'contained'} type={'submit'} className={'color'}>Transfer Now</Button>
        </Box>
            </Grid>
        </Grid>
        </Box>
        </>
    )
}
export default Transfer;