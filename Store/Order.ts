import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IOrders } from "../Helpers/Types";

interface InitialStateType {
    user: string,
    order: IOrders
}

const initialState: InitialStateType = {
    user: "",
    order: {
        name: "",
        shippingProvider: "string",
        trackingId: "",
        refund: false,
        productId: {
            title: "",
            price: 0,
            photo: [],
            owner: {
                name: "",
                _id: "",
                logo: "",
                sales: 0,
                owner: {
                    location: "",
                    accId: null,
                    paypal: null,
                    owner: ""
                },
                location: "",
                currency: "",
                disabled: false,
                domesticShipping: {
                    express: 0,
                    standard: 0
                }
            },
            ratingId: {
                averageRating: 0,
                ratings: [],
            },
            shipping: [
                {
                    standard: {
                        price: 0,
                        country: 'US'
                    },
                    express: {
                        price: 0,
                        country: 'US'
                    }
                }
            ],
            discount: 0,
            _id: "",
        },
        status: "",
        _id: "",
        createdAt: "",
        updatedAt: "",
        address: "",
        shipping: "standard",
        shippingCost: 0,
        variants: [],
        value: '',
        sellerId: {
            _id: "",
            name: ""
        }
    },
}



const order = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setSelectedOrder(state: InitialStateType, action: PayloadAction<InitialStateType>) {
            state.order = action.payload.order;
            state.user = action.payload.user;
        },
    }
})

export const { setSelectedOrder } = order.actions;

export default order.reducer;
