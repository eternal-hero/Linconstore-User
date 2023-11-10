import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface Istepper {
    step: number,
    stepper: number
}
const initialState : Istepper  = {
    step: 1,
    stepper: 1
}
const StepperStore  = createSlice({
    name: 'Stepper',
    initialState,
    reducers: {
        increment: (state, action: PayloadAction<number>) => {
            state.step = state.step + action.payload;
        },
        decrement: (state, action: PayloadAction<number>) => {
            state.step = state.step - action.payload;
        },
        incrementStepper: (state, action: PayloadAction<number>) => {
            state.stepper = state.stepper + action.payload;
        },
        decrementStepper: (state, action: PayloadAction<number>) => {
            state.stepper = state.stepper - action.payload;
        }
    }

})
export const {increment, decrement, decrementStepper, incrementStepper} = StepperStore.actions;
export const stepperStore = StepperStore.reducer;