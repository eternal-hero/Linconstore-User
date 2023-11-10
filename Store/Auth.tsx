import {createSlice} from "@reduxjs/toolkit";

export interface IUserInfo {
    email: string;
    _id: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    otp: number;
    phone: string;
    customer_id: string;
    isVerified: boolean;
    plan: string;
    // endDate: Date;
    subId: string;
    payId: string | null;
    shipping: string;
    orders: number;
    accId: string;
    paypal: string;
    isClosed: boolean;
    sellerId: string;
}
interface IAuth {
    isLoggedIn: boolean,
    token: string,
    adminToken: string,
    userInfo: IUserInfo
}
const initialState : IAuth = {
           isLoggedIn : false,
            token : '',
            adminToken: '',
            userInfo: {
                email: '',
                _id: '',
                password: '',
                firstName: '',
                lastName: '',
                role: '',
                otp: 0,
                phone: '',
                customer_id: '',
                isVerified: false,
                plan: '',
                // endDate: new Date(),
                subId: '',
                payId: '',
                shipping: '',
                orders: 0,
                accId: '',
                paypal: '',
                isClosed: false,
                sellerId: '',
            },
}

const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginHandler(state: IAuth){
            state.isLoggedIn = true
        },
        logoutHandler(state : IAuth) {
            state.isLoggedIn = false
        },
        insertTokenAndUserInfo(state: IAuth, action){
            state.token = action.payload.token
            state.userInfo = action.payload.userInfo
        },
        loginAdmin(state: IAuth, action) {
            state.adminToken = action.payload.token;
        },
        deleteToken(state: IAuth){
            state.token = ''
        }
    }
})
export const {loginHandler, loginAdmin, insertTokenAndUserInfo, deleteToken,  logoutHandler} = auth.actions;

export default auth.reducer