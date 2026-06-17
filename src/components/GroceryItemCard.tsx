'use client'
import { addToCart, decreaseQuantity, increaseQuantity } from "@/redux/cartSlice"
import { AppDispatch, RootState } from "@/redux/store"
import { Minus, Plus, PlusCircle, ShoppingCart } from "lucide-react"
import mongoose from "mongoose"
import { motion } from "motion/react"
import Image from "next/image"
import { useDispatch, useSelector } from "react-redux"


export interface IGrocery{
    _id : mongoose.Types.ObjectId
    name:string,
    category: string,
    price: string,
    unit:string,
    image:string,
    createdAt? : Date,
    updatedAt?: Date
}


function GroceryItemCard({ grocery }: { grocery: IGrocery }) {
  const dispatch = useDispatch<AppDispatch>()
  const {cartData} = useSelector((state: RootState) => state.cart)
  const id = grocery._id
  const item = cartData.find((item) => item._id === id)
  const itemQuantity = item?.quantity
  return (
    <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true, amount: 0.5 }}
        className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col group/card"
    >
      <div className="relative w-full aspect-[4/3] bg-gray-50/50 overflow-hidden">
        <Image 
            src={grocery.image} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-contain p-6 transition-transform duration-300 group-hover/card:scale-102"
            alt={grocery.name}
        />
        <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/5 transition-colors duration-300"></div>
      </div>

      <div className="flex flex-col flex-1 p-3.5 items-start">
        
        <p className="text-[10px] font-medium mb-1.5 tracking-wider bg-gray-200 rounded-full px-2 py-1 text-gray-700">
          {grocery.category}
        </p>
        
               <h3 className="text-base sm:text-lg font-bold text-gray-800 line-clamp-2 leading-snug mb-2 flex-1">
          {grocery.name}
        </h3>

        <div className="flex items-end gap-1 mb-2 mt-auto">
          <span className="text-lg font-bold text-green-800">₹{grocery.price}</span>
          <span className="text-xs font-medium text-gray-500 mb-1">/ {grocery.unit}</span>
        </div>

        
        {itemQuantity ? (

          <div className="w-full bg-green-600 text-white border border-gray-300 rounded-2xl py-2.5 px-8 font-semibold text-sm transition-colors duration-300 flex items-center justify-between gap-2 group/btn">
            <button
            className="cursor-pointer active:scale-98 "
            onClick={() => {dispatch(increaseQuantity(id))
              console.log("Increased")
            }}
            >
             <Plus size={18} /> 
            </button> 
            <p>{itemQuantity}</p>
            <button
            className="cursor-pointer active:scale-98"
            onClick={(e) => dispatch(decreaseQuantity(id))}
            >
             <Minus size={18} /> 
            </button> 
          </div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.96 }}
            className="w-full bg-green-600 text-white border border-gray-300 hover:bg-green-700 rounded-2xl py-2.5 px-4 font-semibold text-sm transition-colors duration-300 flex items-center justify-center gap-2 group/btn cursor-pointer"
            onClick={(e) => dispatch(addToCart({...grocery, quantity:1}))}
        >
          <ShoppingCart size={18} className="group-hover/btn:-rotate-12 transition-transform duration-300" /> 
          Add to cart
        </motion.button>
        )}
      </div>
    </motion.div>
  )
}

export default GroceryItemCard