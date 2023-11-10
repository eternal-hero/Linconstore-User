import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import TextInput from "../TextInput";
import Button from "@mui/material/Button";
import { Grid, Stack, useMediaQuery } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import styled from 'styled-components'
import * as yup from "yup";
import ReactInputVerificationCode from "react-input-verification-code";
import { ArrowBack } from "@mui/icons-material";
import { decrementStepper } from "../../Store/Stepper";
import { useDispatch } from "react-redux";
type IPassword = {
    password: string
}
const schema = yup.object().shape({
    password: yup.string().required().min(6),
})
interface Iverify {
    isInvalid: boolean,
};
const StyledReactInputVerificationCode = styled.div`
  display: flex;
  --ReactInputVerificationCode-itemWidth: 40px;
  --ReactInputVerificationCode-itemHeight: 45px;
  --ReactInputVerificationCode-itemSpacing: 4px;
  .ReactInputVerificationCode__item {
    font-size: 12px;
    font-weight: 400;
    color: black;
     background: #fff;
     border: 2px solid 
       ${({ isInvalid }: Iverify) => (isInvalid ? "#EF6C65" : "rgba(28, 30, 60, 0.4)")};
    box-shadow: none;
  }

  .ReactInputVerificationCode__item.is-active {
    box-shadow: none;
    border: 1px solid #36c6d9;
  }
`;
const ChangePin: React.FC = () => {
    const { handleSubmit, control, getValues, reset, formState: { errors } } = useForm<IPassword>({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            password: '',
        }
    })
    const [isValid, setIsValid] = React.useState<boolean>(false);
    const [value, setValue] = React.useState<string>('');
    const [isCompleted, setIsCompleted] = React.useState<boolean>(false);
    const [error, setError] = React.useState<boolean | null>();
    const onSubmit: SubmitHandler<IPassword> = (data) => {
        reset()
    }
    const isMobile: boolean = useMediaQuery('(max-width: 600px)');
    const dispatch = useDispatch();
    return (
        <>
            <ArrowBack onClick={() => dispatch(decrementStepper(2))} className={'pointer'} />
            <Box sx={{ p: 2, border: '2px solid black' }}>
                <Stack sx={{ borderBottom: '1px solid black' }}>
                    <Typography variant={'h6'}>Change Debit card pin </Typography>
                </Stack>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
                    <Typography variant={'body2'}>Enter new pin  </Typography>
                    <Grid container>
                        <Grid item xs={4} >
                            <StyledReactInputVerificationCode isInvalid={isValid} >
                                <ReactInputVerificationCode
                                    value={value}
                                    placeholder={''}
                                    length={4}
                                    onCompleted={() => { setIsCompleted(true) }}
                                    onChange={(newValue) => {
                                        setValue(newValue);
                                        if (newValue !== "") {
                                            setError(null);
                                        }
                                    }}
                                />
                            </StyledReactInputVerificationCode>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} sm={4} >
                            <Controller
                                name='password'
                                control={control}
                                render={({ field, formState: { errors } }) => (
                                    <TextInput
                                        data={errors?.password} field={field} id='Enter password' type={'password'}
                                    />
                                )
                                }
                            />
                        </Grid>
                    </Grid>
                    <Button fullWidth={isMobile} variant={'contained'} type={'submit'} className={'color'}
                        onClick={() => {
                            setIsValid(true);
                            setTimeout(() => { setIsValid(false) }, 1000)
                        }}
                    >
                        Change Pin</Button>
                </Box>
            </Box>
        </>
    )
}
export default ChangePin;