'use client'
import { ArrowLeft, Minus, Plus, ShoppingBag, ShoppingCart, Trash2, ArrowRight, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import Link from 'next/link'
import Image from 'next/image'
import { decreaseQuantity, increaseQuantity, removeItem } from '@/redux/cartSlice'

export default function CartPage() {
  const router = useRouter()
  const { cartData, subTotal, deliveryFee, finalTotal } = useSelector((state: RootState) => state.cart)
  const dispatch = useDispatch<AppDispatch>()

  return ( 
    <>
    
    
    {cartData.length === 0 ? (
    <motion.div

      initial={{ opacity: 0, y: 20 }}

      animate={{ opacity: 1, y: 0 }}

      transition={{ duration: 0.4 }}

      className='flex flex-col items-center justify-center text-center py-16 px-6 gap-6 h-screen border border-gray-100 '

    >

      <motion.div

        initial={{ scale: 0.5, opacity: 0, rotate: -10 }}

        animate={{ scale: 1, opacity: 1, rotate: 0 }}

        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}

        className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6"

      >

        <ShoppingCart className="w-10 h-10 text-green-500" strokeWidth={1.5} />

      </motion.div>



      <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">

        Your cart is empty

      </h2>

      <p className="text-gray-500 text-sm sm:text-base mb-8 max-w-lg leading-relaxed">

        Looks like you haven't added anything yet. Explore our aisles to find fresh groceries!

      </p>



      <Link href={'/'}>

        <motion.button

          whileTap={{ scale: 0.96 }}

          className='bg-green-600 text-white px-8 py-3.5 rounded-xl hover:bg-green-700 transition-colors duration-200 inline-flex font-semibold text-sm shadow-lg shadow-green-600/20 cursor-pointer'

        >

          Browse Groceries

        </motion.button>

      </Link>

    </motion.div>
      ) : (
        <div className="min-h-screen bg-gray-50/50 pb-16">
        <div className="w-[95%] sm:w-[90%] max-w-6xl mx-auto pt-8">
          
          <div className="flex items-center gap-4 mb-8">
            <button
              className="inline-flex text-gray-600 gap-2 items-center font-semibold text-sm group hover:text-green-700 transition-colors duration-200 cursor-pointer bg-white border border-gray-200 rounded-full p-2.5 sm:px-5 sm:py-2.5 shadow-sm hover:shadow-md"
              onClick={() => router.push('/')}
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="hidden sm:block">Continue Shopping</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight ml-2">
              Your Cart
            </h1>
            <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm ml-auto sm:ml-2">
              {cartData.length} items
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cartData.map((item, idx) => (
                  <motion.div
                    key= {idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50, scale: 0.95 }}
                    className="flex p-3 sm:p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 gap-4 group relative"
                  >
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100/50 border border-gray-100">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        className="object-contain p-3 mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="flex-1 flex flex-col py-1">
                      <div className="flex justify-between items-start pr-1">
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-gray-800 line-clamp-2 leading-snug pr-4">
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1 font-medium">{item.unit}</p>
                        </div>
                        <button
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                          onClick={() => dispatch(removeItem(item._id))}
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-3">
                        <p className="text-lg font-black text-gray-900 tracking-tight">
                          ₹{Number(item.price) * item.quantity}
                        </p>
                        
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm h-8 sm:h-9">
                          <button
                            onClick={() => dispatch(decreaseQuantity(item._id))}
                            className="w-8 sm:w-10 h-full flex items-center justify-center hover:bg-green-100 hover:text-green-700 transition-colors text-gray-600 cursor-pointer"
                          >
                            <Minus size={14} strokeWidth={2.5} />
                          </button>
                          <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-bold text-gray-800 select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => dispatch(increaseQuantity(item._id))}
                            className="w-8 sm:w-10 h-full flex items-center justify-center hover:bg-green-100 hover:text-green-700 transition-colors text-gray-600 cursor-pointer"
                          >
                            <Plus size={14} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl px-5 py-4 lg:sticky lg:top-24 border border-gray-100"
            >
              <h2 className="text-xl font-bold mb-6 text-gray-900">Order Summary</h2>
              
              <div className="space-y-4 text-sm sm:text-base text-gray-600 font-medium">
                <div className="flex justify-between items-center">
                  <span>Item Total</span>
                  <span className="text-gray-900 font-semibold">₹{subTotal}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Delivery Partner Fee</span>
                  <span className="text-gray-900 font-semibold">₹{deliveryFee}</span>
                </div>

                {deliveryFee > 0 && (
                  <div className="bg-blue-50 text-blue-700 text-xs px-3 py-2 rounded-lg font-semibold flex items-center gap-2">
                    <ShoppingCart size={14} />
                    Add ₹{399 - subTotal > 0 ? 399 - subTotal : 0} more for FREE Delivery!
                  </div>
                )}

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-dashed border-gray-200"></div>
                  </div>
                </div>

                <div className="flex justify-between items-center pb-2">
                  <span className="text-lg font-bold text-gray-900">To Pay</span>
                  <span className="text-2xl font-black text-green-700 tracking-tight">₹{finalTotal}</span>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 transition-colors duration-200 font-semibold text-base text-white py-3 rounded-xl cursor-pointer shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 group"
              >
                Proceed to Checkout
                <ArrowRight size={18} className='group-hover:translate-x-1 transition-all duration-200'/>
              </motion.button>
              
              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400 font-medium">
                <ShieldCheck size={14} className='text-blue-600' />
                Secure Checkout
              </div>
            </motion.div>
          </div>
        </div>
        </div>
      )}
    </>
  )
}