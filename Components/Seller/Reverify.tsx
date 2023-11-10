import React, {ChangeEvent} from "react";
import * as yup from "yup";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {Box, Container} from "@mui/system";
import {useUpdateSellerDoc} from "../../hooks/useDataFetch";
import {CircularProgress, FormHelperText, Stack, Tooltip, useMediaQuery} from "@mui/material";
import Button from "@mui/material/Button";
import {PhotoCamera} from "@mui/icons-material";
import {uploadImage} from "../../Helpers/utils";
import {useRouter} from "next/router";

const schema = yup.object().shape({
    attachment: yup.mixed().required('You Must upload a document').test("fileSize", "File Size is too large", (value) => {
        if (value){
            return     value.size <= 2000000;
        }
        return  false;
    })
})
type IVerify = {
    attachment: File | null
}
const Reverify  : React.FC =  () => {
        const  {handleSubmit, control,reset, setValue, formState: {errors}} =  useForm<IVerify>({
            defaultValues: {
                attachment: null
            },
            mode: 'onChange',
            resolver: yupResolver(schema)
        })
        const router = useRouter();

    const onSubmit : SubmitHandler<IVerify> = async (data) => {
            const {attachment} = data;
            const file = await uploadImage(attachment);
            const newData = {
                file
            }
            updateDoc(newData)
    }
    const onSuccess = () => {
                router.back()
    }
    const {isLoading, mutate: updateDoc} =  useUpdateSellerDoc(onSuccess)
    const isMobile : boolean = useMediaQuery(('(max-width: 600px)'));
        return (
            <Container component={'main'} maxWidth={'sm'}>
                <Box sx={{display : 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    marginTop: 8
                }}>

                    <Box component={'form'}  noValidate onSubmit={handleSubmit(onSubmit)} >
                        <Stack spacing={0} sx={{
                            background: '#f3f2f2',
                            display: 'flex',
                            borderRadius: '8px',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 3
                        }}>
                            <Controller
                                name={`attachment`}
                                control={control}
                                render={({field: {onChange}}) => (
                                    <> <input
                                        type="file"
                                        accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf"
                                        hidden
                                        id={`attachment`}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            setValue(`attachment`, e.target.files && e.target.files[0]);
                                        }}
                                    />
                                        <Tooltip key="Select Doc" title={'Business document'}>
                                            <label htmlFor={`attachment`}>
                                                <Button
                                                    variant="contained"
                                                    component="span"
                                                    startIcon={<PhotoCamera fontSize="large"/>
                                                    }
                                                    fullWidth={isMobile}
                                                >
                                                    upload
                                                </Button>
                                            </label>
                                        </Tooltip>
                                    </>
                                )
                                }
                            />
                            <FormHelperText sx={{color: 'red'}}>{errors?.attachment?.message}</FormHelperText>
                        </Stack>
                        <Button
                            disabled={isLoading}
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{borderRadius: '20px', mt: 3, mb: 2, backgroundColor: '#000'}}
                        >
                            {isLoading && <CircularProgress/>}
                            upload
                        </Button>
                    </Box>
                </Box>

            </Container>
            )
}
export default Reverify;