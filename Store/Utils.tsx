import {createSlice, PayloadAction} from "@reduxjs/toolkit"

type initialState = {
    snackbarOpen: boolean,
    message: string,
    severity: string,
    rate: number,
    sellerRate: number
}
type IRate = {
    rate: number
}
type ISellerRate = {
    sellerRate: number
}
const initialState : initialState = {
    snackbarOpen: false,
    message: '',
    severity: 'success',
    rate: 0,
    sellerRate: 0
}


const util = createSlice({
    initialState,
    name: 'util',
    reducers: {
        snackBarOpen(state: initialState, action: PayloadAction<initialState>){
            state.snackbarOpen = true;
            state.message = action.payload.message
            state.severity = action.payload.severity
        },
        snackbarEnd(state:  initialState){
            state.snackbarOpen = false;
            state.message = '';
            state.severity = ''
        },
        saveRate(state:IRate, action: PayloadAction<IRate>) {
            state.rate = action.payload.rate;
        },
        saveSellerRate(state: ISellerRate, action: PayloadAction<ISellerRate>){
            state.sellerRate = action.payload.sellerRate;
        }
    }
})
export const { snackBarOpen, snackbarEnd, saveRate, saveSellerRate } = util.actions;
export default util.reducer;
