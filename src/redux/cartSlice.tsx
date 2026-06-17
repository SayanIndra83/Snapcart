import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mongoose from "mongoose";

interface IGrocery{
    _id : mongoose.Types.ObjectId
    name:string,
    category: string,
    price: string,
    unit:string,
    image:string,
    quantity: number
}

interface ICart{
    cartData: IGrocery[],
    subTotal: number,
    finalTotal:number,
    deliveryFee: number
}
const initialState:ICart = {
    cartData: [],
    subTotal: 0,
    deliveryFee:40,
    finalTotal:40
}
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers:{
        addToCart: ((state, action:PayloadAction<IGrocery>) => {
        state.cartData.push(action.payload)
        cartSlice.caseReducers.calculateTotals(state)
    }
        ),
        increaseQuantity: ((state, action:PayloadAction<mongoose.Types.ObjectId>) => {
            const id = action.payload
            const item = state.cartData.find((e) => e._id === id)
            // console.log(item)
            if(item){
                item.quantity = item.quantity + 1
            }
            cartSlice.caseReducers.calculateTotals(state)
        }),
        decreaseQuantity: ((state, action:PayloadAction<mongoose.Types.ObjectId>) => {
            const id = action.payload
            const item = state.cartData.find((e) => e._id === id)
            if(item && item?.quantity>0){
                item.quantity = item.quantity - 1
                // console.log(item.quantity)
                if(item.quantity == 0){
                    state.cartData = state.cartData.filter((e) => e._id !== id)
                }
            }
            cartSlice.caseReducers.calculateTotals(state)
        }),
        removeItem:((state, action:PayloadAction<mongoose.Types.ObjectId>) => {
            state.cartData = state.cartData.filter((item) => item._id !== action.payload)
            cartSlice.caseReducers.calculateTotals(state)
        }),
        calculateTotals : ((state) => {
            state.subTotal = state.cartData.reduce((sum, item) => sum + (Number(item?.price)*item.quantity), 0)
            if(state.subTotal >= 199 && state.subTotal <= 399) state.deliveryFee = 20
            else if(state.subTotal > 399) state.deliveryFee = 0
            else state.deliveryFee = 40
            state.finalTotal = state.subTotal + state.deliveryFee
        })
    },
})

export const {addToCart, increaseQuantity, decreaseQuantity, removeItem, calculateTotals} = cartSlice.actions
export default cartSlice.reducer