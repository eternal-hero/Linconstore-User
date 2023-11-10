import React, { Dispatch, SetStateAction, useState } from 'react';
import { Box, Typography, Select, MenuItem, TextField, InputAdornment, SelectChangeEvent } from '@mui/material';
import { Search } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export type SearchOptionType = {
    field: string;
    keyword: string;
}

type HeaderPropsType = {
    title: string;
    searchFields: string[];
    totalAmount?: number;
    searchOption: SearchOptionType;
    setSearchOption: Dispatch<SetStateAction<SearchOptionType>>;
    calendar?: boolean
    setDateChange?: any
}


const Header: React.FC<HeaderPropsType> = ({ title, searchFields, totalAmount, searchOption, setSearchOption, calendar = false, setDateChange }) => {

    const handleSelectChange = (event: SelectChangeEvent) => {
        setSearchOption(prevState => ({ ...prevState, field: event.target.value as string }));
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchOption(prevState => ({ ...prevState, keyword: event.target.value }));
    };

    const [dateValue, setDateValue] = useState();

    const handleDateChange = (e) => {
        setDateValue(e)
        setDateChange(e)
    }

    return (
        <Box px={2} py={1} bgcolor={"white"} alignItems={"center"} display={"flex"} justifyContent={"space-between"}>
            <Box display={"flex"} gap={2} alignItems={"center"} width={"100%"}>
                <Typography fontSize={14}>{title}</Typography>
                <Select
                    size='small'
                    sx={{ width: "150px" }}
                    value={searchOption.field}
                    onChange={handleSelectChange}
                >
                    {
                        searchFields.map((field, index) => {
                            return (
                                <MenuItem key={index} value={field}>{field}</MenuItem>
                            )
                        })
                    }
                </Select>
                <TextField
                    size='small'
                    sx={{ width: "50%" }}
                    value={searchOption.keyword}
                    onChange={handleInputChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <Search />
                            </InputAdornment>
                        )
                    }}
                />
            </Box>
            <Box display={"flex"} alignItems={"center"} gap={2}>
                <Typography>{totalAmount}</Typography>
                {
                    calendar && (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker value={dateValue} onChange={handleDateChange} renderInput={props => <TextField {...props} size='small' />} />
                        </LocalizationProvider>
                    )
                }

            </Box>
        </Box>
    )
}

export default Header