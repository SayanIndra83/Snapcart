import mongoose, { Model } from "mongoose"
export interface IOrder extends Document {
user: mongoose.Types.ObjectId,
_id?: mongoose.Types.ObjectId,
createdAt?: Date,
updatedAt?: Date,
items:[
    {
        grocery: mongoose.Types.ObjectId,
        name:string,
        price: string,
        unit:string,
        image:string,
        quantity: number
    }
],
totalAmount : number,
paymentMethod : "cod" | "online",
address:{
    fullName: string,
    city: string,
    pincode: string,
    state: string,
    fullAddress: string,
    mobile: string,
    lattitude: number, 
    longitude: number
}
status: "pending" | "out of delivery" | "delivered",
isPaid: boolean
}

const orderSchema = new mongoose.Schema<IOrder>({
user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
},
items:[
    {
        grocery:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Grocery"
        },
        name: String,
        price: String,
        unit:String,
        image:String,
        quantity: Number
    }
],
paymentMethod:{
    type: String,
    required: true,
    enum: ["cod", "online"],
    default:"cod"
},
address:{
    fullName: String,
    city: String,
    pincode: String,
    state: String,
    fullAddress: String,
    mobile: String,
    lattitude: Number, 
    longitude: Number
},
status:{
    type:String,
    default:"pending",
    enum:["pending", "out of delivery", "delivered"]
},
totalAmount : Number,
isPaid: {
    type: Boolean,
    default:false
}
}, {timestamps: true})

const OrderModel = (mongoose.models.Order as Model<IOrder> || mongoose.model<IOrder>("Order", orderSchema))

export default OrderModel