import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import TextInput from "../TextInput";
import Button from "@mui/material/Button";
import {Grid, Stack} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {ArrowBack} from "@mui/icons-material";
import {decrement} from "../../Store/Stepper";
import {useDispatch} from "react-redux";
type Ibilling = {
    card: number,
    expires: string,
    ccv: number,
}
const schema = yup.object().shape({
    card: yup.number().typeError('Must be a number').required().min(1),
    expires: yup.string().required().min(5),
    ccv: yup.number().typeError('Must be a number').required().min(1),
})
const Billing : React.FC = () => {
    const {  handleSubmit, control,  reset } = useForm<Ibilling>({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            card: 0,
            expires: '',
            ccv: 0,
        }
    })
    const onSubmit: SubmitHandler<Ibilling> = (data) => {
        reset()
    }
    const dispatch = useDispatch();
    return (
        <>
            <ArrowBack onClick={() => dispatch(decrement(3))} className={'pointer'}/>
            <Box sx={{p:2, border : '2px solid black', my:2}}>
            <Stack sx={{borderBottom: '1px solid black'}}>
                <Typography variant={'h6'}>Payment method </Typography>
            </Stack>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
                <Grid container>
                    <Grid item xs={12} sm={6}>
                        <Controller
                            name='card'
                            control={control}
                            render={({field, formState: {errors}}) => (
                                <TextInput
                                    data={errors?.card} field={field} id=' Card number' type={'number'}
                                />
                            )
                            }
                        />
                        <Grid item container spacing={2}>
                            <Grid item xs={6} >
                                <Controller
                                    name='expires'
                                    control={control}
                                    render={({field, formState: {errors}}) => (
                                        <TextInput
                                            data={errors?.expires} field={field} id='Expires'
                                        />
                                    )
                                    }
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controller
                                    name='ccv'
                                    control={control}
                                    render={({field, formState: {errors}}) => (
                                        <TextInput
                                            data={errors?.ccv} field={field} id='ccv' type={'number'}
                                        />
                                    )
                                    }
                                />
                            </Grid>
                        </Grid>

                    </Grid>
                </Grid>

                <Button variant={'outlined'} type={'submit'} color={'inherit'} className={'colorReversed'}>Add card </Button>
            </Box>
        </Box>
            <Box sx={{p:2, border : '2px solid black'}}>
                <Stack sx={{borderBottom: '2px solid black'}}>
                    <Typography variant={'h6'}>Subscription </Typography>
                </Stack>
                <Stack spacing={2}>
                    <Typography variant={'body1'}>Current subscription : basic plan renews on 08/08/22 </Typography>
                    <Button variant={'contained'} sx={{maxWidth: '200px'}} className={'color'} color={'inherit'} >Cancel subscription</Button>
                </Stack>
            </Box>
        </>
    )
}
export default Billing;