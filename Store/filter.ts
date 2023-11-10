import {PayloadAction, createSlice} from "@reduxjs/toolkit";

type InitialStateType = {
    openFilter: boolean;

}

const initialState: InitialStateType = {
    openFilter: false
}

const filter = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setOpenCloseFilter(state: InitialStateType , action: PayloadAction<boolean>) {
            state.openFilter = action.payload;
        },
    }
})

export const { setOpenCloseFilter, } = filter.actions;

export default filter.reducer;