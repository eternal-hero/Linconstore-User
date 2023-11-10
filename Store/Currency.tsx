import {createSlice, PayloadAction} from "@reduxjs/toolkit"

type initialState = {
   currency : string
}
const initialState : initialState = {
    currency: ''
}
const currency = createSlice({
    initialState,
    name: 'currency',
    reducers: {
        saveCurrency(state: initialState, action: PayloadAction<initialState>){
            state.currency = action.payload.currency;
        },
    }
})
export const { saveCurrency} = currency.actions;
export default currency.reducer;
