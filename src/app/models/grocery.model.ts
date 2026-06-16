import mongoose, { Model } from "mongoose"
interface IGrocery extends Document{
    name:string,
    category: string,
    price: string,
    unit:string,
    image:string,
}

const grocerySchema = new mongoose.Schema<IGrocery>({
name:{
    type:String,
    required:true,
},
category:{
    type:String,
    enum:[
        "Fruits & Vegetables",
        "Dairy & Eggs",
        "Rice, Atta & Grains",
        "Snacks & Biscuits",
        "Spices & Masalas",
        "Beverages & Drinks",
        "Personal Care",
        "Household Essentials",
        "Instant & Packaged Food",
        "Baby & Pet Care"
    ],
    required:true,
},
price:{
    type:String,
    required: true
},
unit:{
    type:String,
    required: true,
    enum:[
        "kg", "g", "liter", "ml", "piece", "pack"
    ]
},
image:{
    type:String,
    required: true
},
}, {timestamps: true})

const GroceryModel = (mongoose.models.Grocery as Model<IGrocery> || mongoose.model<IGrocery>("Grocery", grocerySchema))

export default GroceryModel