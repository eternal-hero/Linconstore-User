import * as React from "react";
import Box from "@mui/material/Box";
import { Autocomplete, Button, FormHelperText, Grid, IconButton, Switch, Typography } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
const schema = yup.object().shape({
    test: yup.array().of(
        yup.object().shape({
            stock: yup.array().of(
                yup.object().shape({
                    name: yup.number().typeError('Must be a number').required("This is a required field."),
                    price: yup.number().typeError('Must be a number').required("This is a required field."),
                    variants: yup.string().required("This is a required field."),
                }))
        })
    ),
});
type stock = {
    name: number,
    price: number,
    variants: string,
}
type hey = {
    stock: stock[],
}
interface ITest {
    test: hey[]
}
interface Ioptions {
    stock: number
}
const Options: React.FC<Ioptions> = ({ stock }) => {
    const { t } = useTranslation();
    const { handleSubmit, control, getValues, watch, setValue, formState: { errors }, reset } = useForm<ITest>({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            test: [{
                stock: [{
                    name: 0,
                    price: 0,
                    variants: '',
                }]
            }]
        }
    })
    // @ts-ignore
    // const stockTotal = watch('test').reduce((index, {stock}) => index + Number.parseInt(stock), 0);
    // const watchStock = watch('test');
    const [isInvalid, setIsInvalid] = useState<boolean>(false);
    const [items, setItem] = useState([{
        options: {
            id: 1,
            name: '',
            value: [{ name: "" }]
        },
    },
    ]);
    // useEffect(()=> {
    //     const isTrue =  stockTotal  > stock ;
    //     setIsInvalid(isTrue)
    // },[stockTotal, stock]);
    const handleChange = (index: number, event: React.ChangeEvent<HTMLInputElement> | any) => {
        const { value } = event.target;
        const values = [...items];
        values[index].options.name = value;
        setItem(values);
    };

    const addItem = () => {
        setItem(prevState => [...prevState, {
            options: {
                id: prevState.length + 1,
                name: '',
                value: [{ name: "" }]
            },
        }])
    };
    const removeItem = (index: number) => {
        let option = [...items];
        // option.splice(index , 1);
        setItem(prevState => [...prevState.filter(data => data.options.id !== index)]);
    };

    const handleAddShare = (index: number) => {
        const values = [...items];
        values[index].options.value = [...values[index].options.value, { name: "" }];
        setItem(values);
    }
    const removeItemName = (id: number, parIndex: number) => {
        const newItem = [...items];
        newItem.forEach((data, parentIndex) => data.options.value.forEach((s, index) => {
            if (index === id && parIndex === parentIndex) {
                return data.options.value.splice(index, 1);
            }
        }));
        setItem(newItem)
        //     this.setState({
        //         value: this.state.value.filter((s, sidx) => idx !== sidx)
        //     });
    }
    //
    //
    const handleNameChange = (idx: number, parIndex: number, event: React.ChangeEvent<HTMLInputElement> | any) => {
        const { value } = event.target;
        const newItem = [...items];
        newItem.forEach((data, parentIndex) => data.options.value.forEach((s, index) => {
            if (index === idx && parIndex === parentIndex) {
                s.name = value;
            }
        }));
        setItem(newItem)
    };
    const myVariant = useRef();
    const onSubmit: SubmitHandler<ITest> = async (data, event) => {
    }
    return (
        <>
            {items.map((data, index) => {
                return (
                    <Box key={index}>
                        <Grid container spacing={1} alignItems="flex-end">
                            <Grid item xs={11}>
                                {/*<Autocomplete*/}
                                {/*    id="address"*/}
                                {/*    options={['Color', 'Size', 'Material']}*/}
                                {/*    // getOptionLabel={(address) => address}*/}
                                {/*    autoSelect*/}
                                {/*    freeSolo*/}
                                {/*    renderInput={(params) => (*/}
                                {/*        <TextField*/}
                                {/*            sx={{mt:2}}*/}
                                {/*            label={"Option" + " " + (index + 1)}*/}
                                {/*            required*/}
                                {/*            {...params}*/}
                                {/*            variant="standard"*/}
                                {/*            color={'primary'}*/}
                                {/*            value={data.options?.name}*/}
                                {/*            // onChange={(event) => handleChange(index, event)}*/}
                                {/*            fullWidth/>*/}
                                {/*    )}*/}

                                {/*    onChange={(event) => handleChange(index, event)}*/}
                                {/*/>*/}
                                <TextField
                                    label={"Variant Type" + " " + (index + 1)}
                                    required
                                    value={data.options?.name}
                                    variant="standard"
                                    color={'primary'}
                                    onChange={(event) => handleChange(index, event)}
                                    fullWidth
                                    helperText={t("seller.post.add_product.color_size_material_style")}
                                />
                            </Grid>

                            <Grid item xs={1}>
                                <div
                                    className="font-icon-wrapper"
                                    onClick={(event) => removeItem(data.options.id)}
                                >
                                    <IconButton aria-label="delete">
                                        <Delete />
                                    </IconButton>
                                </div>
                            </Grid>
                        </Grid>

                        {data.options.value.map((name, id) => (
                            <Box key={id}>
                                <Grid container spacing={1} alignItems="flex-end">
                                    <Grid item xs={11}>
                                        <TextField
                                            label={"Variant Option" + " " + (id + 1)}
                                            variant="standard"
                                            required
                                            value={name.name}
                                            onChange={(event) => handleNameChange(id, index, event)}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <div
                                            className="font-icon-wrapper"
                                            onClick={() => removeItemName(id, index)}>
                                            <IconButton aria-label="delete">
                                                <Delete />
                                            </IconButton>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Box>
                        ))}
                        <Grid item xs={2}>
                            <div
                                className="font-icon-wrapper"
                                onClick={() => handleAddShare(index)}
                            >
                                <IconButton aria-label="delete">
                                    <Add />
                                </IconButton>
                            </div>
                        </Grid>
                    </Box>
                )
            })}
            <Button onClick={addItem} sx={{ color: 'black' }} startIcon={<Add />} color="primary">
                Add new variant
            </Button>
            {items.length > 1 &&
                <>
                    <Typography variant={'h6'}>Edit Variant</Typography>
                    <Grid container spacing={2}>

                        <Grid item xs={4} sm={6} lg={3}>
                            Variant
                        </Grid>
                        <Grid item xs={4} sm={6} lg={3}>
                            Price
                        </Grid>
                        <Grid item xs={4} sm={6} lg={3}>
                            Stock
                        </Grid>
                    </Grid>
                    {items.map((data, index) => (
                        data.options.name !== '' && data.options.value.map((name, id) => {
                            if (name.name !== '') {
                                // @ts-ignore
                                return (
                                    <Box key={id + index}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6} lg={3} mt={3}>
                                                <Typography >
                                                    {data.options.name} /  {name.name}
                                                </Typography>
                                                {/*<Controller*/}
                                                {/*    control={control}*/}
                                                {/*    name={`test.${index}.stock.${id}.variants`}*/}
                                                {/*    // defaultValue={`${data.options.name} /  ${name.name}`}*/}
                                                {/*    render={({field : {onChange}, formState: {errors}}) => (*/}
                                                {/*        <TextField*/}
                                                {/*            margin="normal"*/}
                                                {/*            required*/}
                                                {/*            fullWidth*/}
                                                {/*            onChange={(e) =>  onChange(e.target.value)}*/}
                                                {/*            value={`${data.options.name} /  ${name.name}`}*/}
                                                {/*            variant={'standard'}*/}
                                                {/*            error={!!errors?.test?.[index]?.stock?.[id]?.variants}*/}
                                                {/*            helperText={errors?.test?.[index]?.stock?.[id]?.variants?.message}*/}
                                                {/*            id={'variants'}*/}
                                                {/*            type={'text'}*/}
                                                {/*            label={'variants'}*/}
                                                {/*            name={'variants'}*/}
                                                {/*        />*/}
                                                {/*    )}*/}
                                                {/*/>*/}
                                            </Grid>
                                            <Grid item xs={12} sm={6} lg={3}>
                                                <Controller
                                                    control={control}
                                                    name={`test.${index}.stock.${id}.price`}
                                                    defaultValue={0}
                                                    render={({ field, formState: { errors } }) => (
                                                        <TextField
                                                            margin="normal"
                                                            required
                                                            fullWidth
                                                            variant={'standard'}
                                                            error={!!errors?.test?.[index]?.stock?.[id]?.price}
                                                            helperText={errors?.test?.[index]?.stock?.[id]?.price?.message}
                                                            {...field}
                                                            id={'price'}
                                                            type={'number'}
                                                            label={t("seller.post.add_product.price_title")}
                                                            name={'price'}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} lg={3}>
                                                <Controller
                                                    control={control}
                                                    name={`test.${index}.stock.${id}.name`}
                                                    defaultValue={0}
                                                    render={({ field, formState: { errors } }) => (
                                                        <TextField
                                                            margin="normal"
                                                            required
                                                            fullWidth
                                                            variant={'standard'}
                                                            error={!!errors?.test?.[index]?.stock?.[id]?.name}
                                                            helperText={errors?.test?.[index]?.stock?.[id]?.name?.message}
                                                            {...field}
                                                            id={'stock'}
                                                            type={'number'}
                                                            label={t("seller.post.add_product.stock_title")}
                                                            name={'stock'}
                                                        />
                                                    )}
                                                />
                                                <FormHelperText sx={{ color: 'red' }}>
                                                    {(watch(`test.${index}.stock`)?.reduce((index, { name }) => index + Number.parseInt(name as unknown as string), 0) > stock) ? t("seller.post.add_product.must_not_be_greater_than_stock") : ''}
                                                </FormHelperText>
                                            </Grid>
                                            <Grid item xs={12} sm={6} lg={3} sx={{ mt: 3 }}>
                                                <Button variant={'outlined'} fullWidth type={'submit'}
                                                    onClick={handleSubmit(onSubmit)}
                                                    className={'color'}>Save</Button>
                                            </Grid>
                                        </Grid>

                                        {/*<Controller*/}
                                        {/*    control={control}*/}
                                        {/*    name={`test?.[${index}]`}*/}
                                        {/*    defaultValue={null}*/}
                                        {/*    render={({ field, formState: {errors} }) => (*/}
                                        {/*        <TextField*/}
                                        {/*        margin="normal"*/}
                                        {/*        required*/}
                                        {/*        fullWidth*/}
                                        {/*        variant={'standard'}*/}
                                        {/*        error={!!errors?.test?.[index]?.stock}*/}
                                        {/*        helperText={errors?.test?.[index]?.stock?.message}*/}
                                        {/*         {...field}*/}
                                        {/*        id={'stock'}*/}
                                        {/*        type={'number'}*/}
                                        {/*        label={'stock'}*/}
                                        {/*        name={'stock'}*/}
                                        {/*        />*/}
                                        {/*    )}*/}
                                        {/*/>*/}

                                    </Box>
                                )
                            }
                        })))}

                </>
            }
        </>
    );
}
export default Options;
