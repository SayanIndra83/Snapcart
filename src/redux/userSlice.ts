import { createSlice } from "@reduxjs/toolkit";
import mongoose from "mongoose";

interface IUser{
    _id?: mongoose.Types.ObjectId
    username: string,
    email: string,
    password?: string,
    mobile?: string,
    role: "user" | "admin" | "deliveryboy",
    otp:string,
    verifycodeExpiry:Date,
    isVerified: boolean,
    userImage?: string,
}

interface IUserSlice {
    userData: IUser | null
}

const initialState:IUserSlice = {
    userData: null
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers:{
        setUserData:(state, action) => {
            state.userData = action.payload
        }
    }
})

export const {setUserData} = userSlice.actions
export default userSlice.reducer


// useSelector hook --> for taking data from store
// useDispatch hook --> for setting data in store
// initialState --> is same as the useState("HERE")
// reducer --> accessing the data from the dispatch and set that to the state
// now in the reducer we write the update functions 
// this name: (state, action) => {state."The state we want to change" = action.payload}
// state gives the current state access and action gives payload which has the new state that we are wanting to update
