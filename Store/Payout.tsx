import {configureStore, createSlice, PayloadAction} from "@reduxjs/toolkit";

interface IPayout {
    open: boolean,
    storeId: string,
    isUpdating: boolean
}

const initialState : IPayout = {
    open: false,
    storeId: '',
    isUpdating: false
}

const payout = createSlice({
    initialState,
    name: 'payout',
    reducers : {
        openModal  (state: IPayout, action: PayloadAction<IPayout>) {
            state.open = true,
                state.storeId = action.payload.storeId
        },
        closeModal (state: IPayout) {
            state.open = false;
            state.storeId = ''
        },
        updatePayout (state: IPayout) {
            state.isUpdating = !state.isUpdating
        }
    }
})

export  const {openModal, closeModal, updatePayout} = payout.actions;

export default payout.reducer;